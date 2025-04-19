
1. Download library for each service in the backend directory:
```Text
    python -m venv .venv 
    .venv/Scripts/activate 
    pip install -r requirements.txt
```
2. Download library for frontend in /frontend directory:
```Text
    npm i
```
3. Download docker và configure redis by run this command in cmd:
```text
docker run -d -p 6379:6379 redis
```
4. Download library for Gateway API:
```text
    python -m venv .venv 
    .venv/Scripts/activate 
    pip install -r requirements.txt
```
5. Run
```text
./start.bat
```
