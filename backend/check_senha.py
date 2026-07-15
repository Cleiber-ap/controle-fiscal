import bcrypt
import psycopg2
import os

conn = psycopg2.connect(os.environ['DATABASE_URL'])
cur = conn.cursor()
cur.execute('SELECT senha_hash FROM usuarios WHERE email = %s', ('cleiber@enovaonline.com.br',))
h = cur.fetchone()[0]
print('Hash:', h)
print('Valido:', bcrypt.checkpw(b'admin123', h.encode('utf-8')))
conn.close()
