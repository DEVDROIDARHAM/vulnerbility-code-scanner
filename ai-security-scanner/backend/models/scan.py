from datetime import datetime
from . import db

class Scan(db.Model):
    __tablename__ = 'scans'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    language = db.Column(db.String(50), nullable=False)
    code_snippet = db.Column(db.Text, nullable=False)
    results = db.Column(db.JSON, nullable=True)
    security_score = db.Column(db.Integer, default=100)
    vulnerability_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'language': self.language,
            'security_score': self.security_score,
            'vulnerability_count': self.vulnerability_count,
            'created_at': self.created_at.isoformat(),
            'results': self.results
        }
