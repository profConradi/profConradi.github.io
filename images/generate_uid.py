import secrets

uid = secrets.token_hex(32)
print(uid)
print(" ".join([str(uid)[i:i+8] for i in range(0,64,8)]))
