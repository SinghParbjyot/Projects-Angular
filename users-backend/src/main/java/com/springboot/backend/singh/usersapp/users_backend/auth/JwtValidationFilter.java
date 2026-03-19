package com.springboot.backend.singh.usersapp.users_backend.auth;

import static com.springboot.backend.singh.usersapp.users_backend.auth.TokenJwtConfig.CONTENT_TYPE;
import static com.springboot.backend.singh.usersapp.users_backend.auth.TokenJwtConfig.HEADER_AUTHORIZATION;
import static com.springboot.backend.singh.usersapp.users_backend.auth.TokenJwtConfig.PREFIX_TOKEN;
import static com.springboot.backend.singh.usersapp.users_backend.auth.TokenJwtConfig.SECRET_KEY;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.lang.Arrays;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

/**
 * Clase que filtra las validaciones en la autenticacion co
 * basicauthtentacionfilter
 */
public class JwtValidationFilter extends BasicAuthenticationFilter {

    public JwtValidationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    @Override
    /**
     * Valida el token para luego poder acceder a los recursos
     */
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        // recogemos el header
        String header = request.getHeader(HEADER_AUTHORIZATION);
        // Validamos si el header es null o si no encuentra el Bearer
        if (header == null || !header.startsWith(PREFIX_TOKEN)) {
            chain.doFilter(request, response);
            return;
        }
        // Aqui hacemos el replace para solo quedarnos con el Bearer
        String token = header.replace(PREFIX_TOKEN, "").trim();
        try {
            // Verificamos el token con la llave secreta para saber si es nuestro token
            Claims claims = Jwts.parser().verifyWith(SECRET_KEY).build().parseSignedClaims(token).getPayload();
            // recogemos el nombre de usuario
            String username = claims.getSubject();
            // String username2 = (String)claims.get("username");
            // recogemos los roles
            Object authoritiesClaims = claims.get("authorities");
            // Debemos aqui hacer un par de procesos porque para hacer la auth debemos pasar
            // el username y los roles

            Collection<? extends GrantedAuthority> roles = Arrays.asList(
                    JsonMapper.builder() // Cambiamos 'new ObjectMapper()' por el Builder
                            .addMixIn(SimpleGrantedAuthority.class, SimpleGrantedAuthorityJsonCreator.class)
                            .build() // Aquí "cerramos" la configuración y nos da el ObjectMapper listo
                            .readValue(authoritiesClaims.toString().getBytes(), SimpleGrantedAuthority[].class));
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username,
                    null, roles);
            // Aqui seteamos la autenticacion
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            // Devolvemos la respuesta
            chain.doFilter(request, response);
        } catch (JwtException e) {
            Map<String, String> body = new HashMap<>();
            body.put("Error", e.getMessage());
            body.put("message", "El token no es valido");
            response.getWriter().write(new ObjectMapper().writeValueAsString(body));
            response.setContentType(CONTENT_TYPE);
        }

    }

}
