import { useState, useEffect, useRef } from "react";
import { Lock, Unlock, ArrowRightLeft, Trash2, Copy, FileDigit, Terminal, CheckCircle2, Info, AlertTriangle, ShieldCheck } from "lucide-react";
import Button from "../components/common/Button";
import Navbar from "../components/layout/Navbar";

const cipherInfo = {
  caesar: {
    desc: 'Caesar Cipher — A substitution cipher shifting each letter by a fixed number (key). Julius Caesar used a shift of 3. Security: Trivially breakable with only 25 possible keys.',
    hasBrute: true,
    opts: 'shift'
  },
  rot13: {
    desc: 'ROT-13 — A special case of Caesar cipher with a fixed shift of 13. Applying it twice returns the original text. Encode and decode are identical operations.',
    hasBrute: false,
    opts: null
  },
  vigenere: {
    desc: 'Vigenère Cipher — Uses a keyword to apply multiple Caesar shifts cyclically. Much stronger than Caesar. Used extensively in the 16th–19th century.',
    hasBrute: false,
    opts: 'keyword'
  },
  base64: {
    desc: 'Base64 Encoding — Encodes binary data into ASCII characters using 64 printable characters. Not encryption — easily reversible. Used in JWT tokens, email attachments, and data URIs.',
    hasBrute: false,
    opts: null
  },
  binary: {
    desc: 'Binary (ASCII) — Converts each character to its 8-bit binary representation. Fundamental to digital communication and computer memory.',
    hasBrute: false,
    opts: null
  },
  hex: {
    desc: 'Hexadecimal — Converts text to hexadecimal (base-16) encoding. Widely used in debugging, memory dumps, network packets, and hash representation.',
    hasBrute: false,
    opts: 'hexsep'
  },
  xor: {
    desc: "XOR Cipher — Applies bitwise XOR with a key. Core to modern stream ciphers and one-time pads. With a truly random key equal to message length, it's theoretically unbreakable.",
    hasBrute: false,
    opts: 'xorkey'
  },
  morse: {
    desc: 'Morse Code — Encodes text using dots (.) and dashes (−) originally for telegraph. Used internationally in aviation, amateur radio, and emergency signaling.',
    hasBrute: false,
    opts: null
  },
  atbash: {
    desc: 'Atbash Cipher — A Hebrew substitution cipher where each letter is mapped to its mirror position (A↔Z, B↔Y). Originally used to encode the Hebrew alphabet.',
    hasBrute: false,
    opts: null
  },
  reverse: {
    desc: 'Reverse — Reverses the input string. Simple but sometimes used in combination with other transforms in obfuscation.',
    hasBrute: false,
    opts: null
  }
};

const MORSE = {
  A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..', J:'.---',
  K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.', Q:'--.-', R:'.-.', S:'...', T:'-',
  U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
  '6':'-....','7':'--...','8':'---..','9':'----.',
  '.':'.-.-.-',',':'--..--','?':'..--..','!':'-.-.--','/':'-..-.','(':'-.--.',')':'-.--.-'
};
const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k,v])=>[v,k]));

function caesarShift(text, shift, encode) {
  shift = ((encode ? shift : -shift) % 26 + 26) % 26;
  return text.split('').map(c => {
    if (/[A-Z]/.test(c)) return String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65);
    if (/[a-z]/.test(c)) return String.fromCharCode((c.charCodeAt(0) - 97 + shift) % 26 + 97);
    return c;
  }).join('');
}

const ciphers = {
  caesar: (text, encode, opts) => caesarShift(text, parseInt(opts.shift) || 13, encode),
  rot13: (text, encode, opts) => caesarShift(text, 13, true),
  vigenere: (text, encode, opts) => {
    const key = (opts.keyword || 'SECRET').toUpperCase().replace(/[^A-Z]/g,'');
    if (!key.length) return text;
    let ki = 0;
    return text.split('').map(c => {
      const isUpper = /[A-Z]/.test(c), isLower = /[a-z]/.test(c);
      if (!isUpper && !isLower) return c;
      const base = isUpper ? 65 : 97;
      const shift = key.charCodeAt(ki++ % key.length) - 65;
      const cc = c.charCodeAt(0) - base;
      const nc = encode ? (cc + shift) % 26 : (cc - shift + 26) % 26;
      return String.fromCharCode(nc + base);
    }).join('');
  },
  base64: (text, encode) => {
    if (!text) return '';
    try {
      return encode ? btoa(unescape(encodeURIComponent(text))) : decodeURIComponent(escape(atob(text.trim())));
    } catch { return '[ERROR: Invalid Base64 input]'; }
  },
  binary: (text, encode) => {
    if (!text) return '';
    if (encode) return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8,'0')).join(' ');
    try {
      return text.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b,2))).join('');
    } catch { return '[ERROR: Invalid binary input]'; }
  },
  hex: (text, encode, opts) => {
    if (!text) return '';
    const sep = opts.hexsep === 'none' ? '' : (opts.hexsep || ' ');
    if (encode) return text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2,'0')).join(sep);
    try {
      return text.trim().replace(/[^0-9a-fA-F]/g,' ').trim().split(/\s+/).map(h => String.fromCharCode(parseInt(h,16))).join('');
    } catch { return '[ERROR: Invalid hex input]'; }
  },
  xor: (text, encode, opts) => {
    if (!text) return '';
    let keyRaw = opts.xorkey || '0xFF';
    let key;
    if (keyRaw.startsWith('0x') || keyRaw.startsWith('0X')) {
      key = [parseInt(keyRaw, 16)];
    } else {
      key = keyRaw.split('').map(c => c.charCodeAt(0));
    }
    if (!key.length || key.some(isNaN)) return '[ERROR: Invalid key]';
    if (encode) {
      return text.split('').map((c,i) => (c.charCodeAt(0) ^ key[i % key.length]).toString(16).padStart(2,'0')).join(' ');
    }
    try {
      return text.trim().split(/\s+/).map((h,i) => String.fromCharCode(parseInt(h,16) ^ key[i % key.length])).join('');
    } catch { return '[ERROR: Invalid hex input for XOR decode]'; }
  },
  morse: (text, encode) => {
    if (!text) return '';
    if (encode) {
      return text.toUpperCase().split('').map(c => c === ' ' ? '/' : (MORSE[c] || '?')).join(' ');
    } else {
      return text.trim().split(' / ').map(word =>
        word.trim().split(' ').map(code => MORSE_REV[code] || '?').join('')
      ).join(' ');
    }
  },
  atbash: (text) => text.split('').map(c => {
    if (/[A-Z]/.test(c)) return String.fromCharCode(90 - (c.charCodeAt(0) - 65));
    if (/[a-z]/.test(c)) return String.fromCharCode(122 - (c.charCodeAt(0) - 97));
    return c;
  }).join(''),
  reverse: (text) => text.split('').reverse().join('')
};

function getBruteForce(input) {
  if (!input) return [];
  return Array.from({length: 25}, (_, i) => ({
    shift: i + 1,
    text: caesarShift(input, i + 1, true)
  }));
}

const CryptoTools = () => {
  const [activeCipher, setActiveCipher] = useState('caesar');
  const [mode, setMode] = useState('encode'); // 'encode' | 'decode'
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [opts, setOpts] = useState({ shift: 13, keyword: 'SECRET', hexsep: ' ', xorkey: '0xFF' });
  const [showBrute, setShowBrute] = useState(false);
  const [logs, setLogs] = useState([]);
  const [copied, setCopied] = useState(false);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => {
      const newLogs = [{ time: new Date().toLocaleTimeString(), msg, type }, ...prev];
      return newLogs.slice(0, 15);
    });
  };

  const processText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    try {
      const result = ciphers[activeCipher](inputText, mode === 'encode', opts);
      setOutputText(result);
      if (result && !result.startsWith('[ERROR')) {
        // Optional: reduce log spam by only logging on explicit actions or debouncing.
      }
    } catch (err) {
      setOutputText(`[ERROR: ${err.message}]`);
    }
  };

  // Auto-process on every change
  useEffect(() => {
    processText();
  }, [inputText, activeCipher, mode, opts]);

  const handleManualProcess = () => {
    processText();
    addLog(`Processed ${mode} using ${activeCipher}`, outputText.startsWith('[ERROR') ? 'error' : 'success');
  };

  const handleCipherChange = (c) => {
    setActiveCipher(c);
    setShowBrute(false);
    addLog(`Switched cipher to ${c}`, 'info');
  };

  const handleSwap = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    const newInput = outputText.startsWith('[ERROR') ? '' : outputText;
    setMode(newMode);
    setInputText(newInput);
    addLog(`Swapped input/output and changed mode to ${newMode}`, 'info');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setShowBrute(false);
    addLog('Cleared input/output', 'info');
  };

  const handleCopy = () => {
    if (!outputText || outputText.startsWith('[ERROR')) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    addLog('Copied output to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="flex-1">
        <div className="min-h-screen bg-transparent pt-12 pb-24 text-text-primary px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="mb-8 animate-reveal">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl shadow-glow">
              <ShieldCheck className="text-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight font-display">
                Crypto<span className="text-primary">Tools</span>
              </h1>
              <p className="text-text-secondary text-sm font-medium mt-1">
                Advanced Cryptography and Encoding Toolkit
              </p>
            </div>
          </div>
        </header>

        {/* Cipher Tabs */}
        <div className="flex flex-wrap gap-2 animate-reveal">
          {Object.keys(cipherInfo).map(c => (
            <button
              key={c}
              onClick={() => handleCipherChange(c)}
              className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 font-display ${
                activeCipher === c
                  ? 'bg-primary text-white shadow-glow'
                  : 'bg-background-elevated border border-border text-text-secondary hover:text-white hover:border-primary/50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Cipher Info Bar */}
        <div className="p-4 rounded-xl glass-card border-primary/20 flex gap-3 text-sm text-text-secondary animate-reveal">
          <Info className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="leading-relaxed">{cipherInfo[activeCipher].desc}</p>
        </div>

        {/* Options Row */}
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl glass-card border-border animate-reveal">
          {/* Mode Toggle */}
          <div className="flex bg-background-surface p-1 rounded-lg border border-border">
            <button
              onClick={() => { setMode('encode'); addLog('Mode set to ENCODE', 'info'); }}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${mode === 'encode' ? 'bg-primary text-white shadow-glow' : 'text-text-muted hover:text-white'}`}
            >
              <Lock className="w-4 h-4" /> ENCODE
            </button>
            <button
              onClick={() => { setMode('decode'); addLog('Mode set to DECODE', 'info'); }}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${mode === 'decode' ? 'bg-primary text-white shadow-glow' : 'text-text-muted hover:text-white'}`}
            >
              <Unlock className="w-4 h-4" /> DECODE
            </button>
          </div>

          {/* Cipher Specific Options */}
          {cipherInfo[activeCipher].opts === 'shift' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Shift:</span>
              <input
                type="number"
                min="1" max="25"
                value={opts.shift}
                onChange={e => setOpts({...opts, shift: e.target.value})}
                className="w-20 bg-background-surface border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors text-white"
              />
            </div>
          )}
          {cipherInfo[activeCipher].opts === 'keyword' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Keyword:</span>
              <input
                type="text"
                value={opts.keyword}
                onChange={e => setOpts({...opts, keyword: e.target.value})}
                className="w-32 bg-background-surface border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors text-white uppercase"
              />
            </div>
          )}
          {cipherInfo[activeCipher].opts === 'hexsep' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Separator:</span>
              <select
                value={opts.hexsep}
                onChange={e => setOpts({...opts, hexsep: e.target.value})}
                className="bg-background-surface border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors text-white cursor-pointer"
              >
                <option value=" ">Space</option>
                <option value="none">None</option>
                <option value=":">Colon</option>
                <option value="-">Dash</option>
              </select>
            </div>
          )}
          {cipherInfo[activeCipher].opts === 'xorkey' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">XOR Key:</span>
              <input
                type="text"
                value={opts.xorkey}
                onChange={e => setOpts({...opts, xorkey: e.target.value})}
                className="w-24 bg-background-surface border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors text-white"
              />
            </div>
          )}

          {/* Brute Force Button */}
          {cipherInfo[activeCipher].hasBrute && (
            <div className="ml-auto">
              <Button
                variant={showBrute ? "primary" : "outline"}
                size="sm"
                onClick={() => { setShowBrute(!showBrute); addLog('Toggled Brute Force Panel', 'info'); }}
              >
                Brute Force
              </Button>
            </div>
          )}
        </div>

        {/* Main Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-reveal">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <FileDigit className="w-4 h-4" /> Input Area
              </label>
              <span className="text-[10px] font-mono text-text-muted">{inputText.length} chars</span>
            </div>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Enter text to process..."
              className="w-full h-64 bg-background-surface border border-border rounded-2xl p-5 text-[13px] font-mono text-white placeholder:text-text-muted/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none resize-none custom-scrollbar"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Output Result
              </label>
              <span className="text-[10px] font-mono text-text-muted">{outputText.length} chars</span>
            </div>
            <div className="relative h-64 border rounded-2xl overflow-hidden shadow-lg transition-colors duration-300 ${outputText.startsWith('[ERROR') ? 'border-severity-critical' : 'border-border'}">
              <textarea
                readOnly
                value={outputText}
                placeholder="Output will appear here..."
                className={`w-full h-full bg-[#050507] p-5 text-[13px] font-mono text-white outline-none resize-none custom-scrollbar ${outputText.startsWith('[ERROR') ? 'text-severity-critical' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 p-4 glass-card border-border rounded-xl animate-reveal">
          <Button variant="primary" onClick={handleManualProcess} className="gap-2">
            Process Text
          </Button>
          <Button variant="secondary" onClick={handleSwap} icon={ArrowRightLeft}>
            Swap
          </Button>
          <Button variant="outline" onClick={handleCopy} className="gap-2">
            {copied ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Output'}
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" onClick={handleClear} icon={Trash2} className="text-severity-critical hover:bg-severity-critical/10 hover:border-severity-critical/30">
            Clear
          </Button>
        </div>

        {/* Brute Force Panel */}
        {showBrute && cipherInfo[activeCipher].hasBrute && inputText && (
          <div className="p-6 rounded-2xl glass-card border-primary/30 animate-reveal">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Brute Force Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getBruteForce(inputText).map((res) => (
                <div key={res.shift} className="p-3 bg-background-elevated border border-border rounded-xl flex flex-col gap-1 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => { setOutputText(res.text); addLog(`Selected brute force shift +${res.shift}`, 'success') }}>
                  <div className="text-[10px] font-bold text-primary">Shift +{res.shift}</div>
                  <div className="text-xs font-mono text-text-secondary truncate">{res.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Operation Log */}
        <div className="glass-card border-border rounded-xl mt-8 overflow-hidden animate-reveal">
          <div className="px-5 py-3 border-b border-border bg-background-elevated/50 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-text-secondary">Activity Log</span>
            <span className="text-[10px] font-mono text-text-muted/50">{logs.length}/15</span>
          </div>
          <div className="p-2 max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-1">
            {logs.length === 0 ? (
              <div className="p-4 text-xs font-mono text-text-muted/50 text-center">No operations yet.</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex flex-wrap items-center gap-3 px-3 py-1.5 hover:bg-white/5 rounded-lg font-mono text-[11px] transition-colors">
                  <span className="text-text-muted/50 shrink-0">{log.time}</span>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${log.type === 'success' ? 'bg-accent shadow-[0_0_8px_rgba(14,165,233,0.8)]' : log.type === 'error' ? 'bg-severity-critical shadow-[0_0_8px_rgba(255,0,60,0.8)]' : 'bg-primary'}`} />
                  <span className={`${log.type === 'error' ? 'text-severity-critical' : 'text-text-secondary'}`}>{log.msg}</span>
                </div>
              ))
            )}
          </div>
        </div>

        </div>
        </div>
      </main>
    </div>
  );
};

export default CryptoTools;
