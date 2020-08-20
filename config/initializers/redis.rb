# Supresses this deprecation warning that completely floods the server and redis logs:
# Redis#exists(key)` will return an Integer in redis-rb 4.3. `exists?` returns a boolean, you should use it instead.
# To opt-in to the new behavior now you can set Redis.exists_returns_integer =  true.
# To disable this message and keep the current (boolean) behaviour of 'exists' you can set `Redis.exists_returns_integer = false`, but this option will be removed in 5.0.
Redis.exists_returns_integer = false
