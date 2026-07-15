import bcrypt
import psycopg2
import os

h = bcrypt.hashpw(b'admin123', bcrypt.gensalt()).decode('utf-8')
conn = psycopg2.connect(os.environ['DATABASE_URL'])
cur = conn.cursor()
cur.execute('UPDATE usuarios SET senha_hash = %s WHERE email = %s', (h, 'cleiber@enovaonline.com.br'))
conn.commit()
cur.execute('SELECT senha_hash FROM usuarios WHERE email = %s', ('cleiber@enovaonline.com.br',))
print('Salvo:', cur.fetchone()[0])
conn.close()
