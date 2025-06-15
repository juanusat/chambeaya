import os
import threading
import ssl
from app import create_app

app = create_app()

def run_http():
    app.run(debug=True,
            host='0.0.0.0',
            port=4250,
            use_reloader=False)

def run_https():
    ssl_ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_ctx.load_cert_chain('cert/cert.pem', 'cert/key.pem')
    app.run(debug=True,
            host='0.0.0.0',
            port=4251,
            ssl_context=ssl_ctx,
            use_reloader=False)

if __name__ == '__main__':
    if os.getenv('PYTHONANYWHERE_DOMAIN'):
        run_http()
    else:
        print(40 * "-")
        print("-> Acceder desde  http://127.0.0.1:4250/")
        print("-> Acceder desde https://127.0.0.1:4251/")
        print(40 * "-")
        print()
        t1 = threading.Thread(target=run_http)
        t2 = threading.Thread(target=run_https)
        t1.start()
        t2.start()
        t1.join()
        t2.join()