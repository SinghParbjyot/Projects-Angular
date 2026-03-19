package com.springboot.backend.singh.usersapp.users_backend.auth;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;

public class TokenJwtConfig {
    // Clave secreta del token la guardamos aqui para tenerla en amibito global para
    // poder utilizarla tanto para crear como para
    // borrar
    public static final SecretKey SECRET_KEY = Jwts.SIG.HS256.key().build();
    public static final String HEADER_AUTHORIZATION = "Authorization";
    public static final String PREFIX_TOKEN = "Bearer";
    public static final String CONTENT_TYPE = "application/json";

}
