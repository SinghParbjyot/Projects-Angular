package com.springboot.backend.singh.usersapp.users_backend.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;


@Configuration// Indica que esta clase contiene definiciones de Beans para el contexto de Spring
public class SpringSecurityConfig {

    @Autowired
    private AuthenticationConfiguration authenticationConfiguration;


    @Bean
    AuthenticationManager authenticationManager(){
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean 
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


    // Registra el filtro de seguridad principal de la aplicación
    @Bean
    /*
        Define que roles pueden hacer distintas peticiones  ademas se desactiva el csrf
        no lo necesitamos porque no guardamos las cookies de session cada peteicion llevara su propio
        token de JWT
    */
    SecurityFilterChain filterChain(HttpSecurity http) {

        return http.authorizeHttpRequests(
        authz -> 
        authz.requestMatchers(HttpMethod.GET, "/api/users", "/api/users/page/{page}").permitAll()
        .requestMatchers(HttpMethod.PUT,"/api/users/{id}").hasAnyRole("ADMIN","USER")
        .requestMatchers(HttpMethod.POST,"/api/users").hasRole("ADMIN")
        .requestMatchers(HttpMethod.DELETE,"/api/users/{id}").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT,"/api/users/{id}").hasRole("ADMIN")
        .anyRequest().authenticated()
        ).addFilter( new JwtAuthenticationFilter(authenticationManager()))
        .addFilter(new JwtValidationFilter(authenticationManager()))
        .cors(cors -> cors.configurationSource(configurationSource()))
        .csrf(config -> config.disable())
    .sessionManagement(managment -> managment.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .build();
    }


    /**
     * Metodo para configurar CORS para establecerlo debemos pasarlo al filterChain , esto es para tener activo el servicio de datos cruzados
     * @return
     */
    @Bean
    CorsConfigurationSource configurationSource(){
        CorsConfiguration config = new CorsConfiguration();
        //Aceptamos cualquier peticion del mundo con el asterisco
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        //Ruta origen del front
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        //Peticiones posibles http desde el front
        config.setAllowedMethods(Arrays.asList("POST","GET","PUT","DELETE"));
        //Especificamos cabeceras de las peticiones authorizarion para que angular nos mande el token y content-type para
        // poder enviar el JSON
        config.setAllowedHeaders(Arrays.asList("Authorization","Content-Type"));
        //Establecemos las credenciales en true para habilitarlas
        config.setAllowCredentials(true);
        // establecemos la configuracion config para todas las peticiones
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    /**
     * Metodo que filtras las cabeceras de las peticiones HTTP debemos de tener cuidado al importar CorsFilter debemos importar el org.springframework.web.filter.CorsFilter
     * y no el de apache.
     * @return corsBean
     * Bean sirve para que spring sepa que debe ejecutar estos metodos al recibir un peticion HTTP
     */
    @Bean
    FilterRegistrationBean<CorsFilter> corsFilter(){
        FilterRegistrationBean<CorsFilter> corsBean = new FilterRegistrationBean<CorsFilter>(new CorsFilter(this.configurationSource()));
        corsBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return corsBean;
    }
}
