package com.springboot.backend.singh.usersapp.users_backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springboot.backend.singh.usersapp.users_backend.entities.Role;
import com.springboot.backend.singh.usersapp.users_backend.entities.User;
import com.springboot.backend.singh.usersapp.users_backend.models.IUser;
import com.springboot.backend.singh.usersapp.users_backend.models.UserRequest;
import com.springboot.backend.singh.usersapp.users_backend.repositories.RoleRepository;
import com.springboot.backend.singh.usersapp.users_backend.repositories.UserRepository;

@Service
/**
 * Clase que implementa la interfaz UserSerivice aqui definimos todos los
 * metodos de la interfaz
 * y debemos especiifar el transactional en cada metodo para que cuando
 * ejecutemos los metodos se ejecuten en la base de datos
 * ademas definimos el repository , basicamente hacemos en esta clase servicio
 * como capa de abstaccion del controlador porque luego todos
 * estos metodos se usan en el controlador, por lo cual asi disminuimos la carga
 * del controlador
 */
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository repository;
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository repository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public List<User> findAll() {

        return (List) this.repository.findAll();
    }

    @Override
    @Transactional
    public Optional<User> findById(@NonNull Long id) {

        return repository.findById(id);
    }

    @Override
    @Transactional
    public User save(User user) {

        user.setRoles(getRoles(user));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return this.repository.save(user);
    }

    private List<Role> getRoles(IUser user) {
        List<Role> roles = new ArrayList<>();
        Optional<Role> optionalRoleUser = roleRepository.findByName("ROLE_USER");
        optionalRoleUser.ifPresent(roles::add);
        if (user.isAdmin()) {
            Optional<Role> optionalRoleAdmin = roleRepository.findByName("ROLE_ADMIN");
            optionalRoleAdmin.ifPresent(roles::add);
        }
        return roles;
    }

    @Override
    @Transactional
    public void deleteById(Long id) {

        repository.deleteById(id);
    }

    @Override
    @Transactional
    public Page<User> findAll(Pageable pageable) {
        return this.repository.findAll(pageable);
    }

    @Override
    @Transactional
    public Optional<User> update(UserRequest userRequest, Long id) {
        Optional<User> userOptional = repository.findById(id);
        if (userOptional.isPresent()) {
            User userDb = userOptional.get();
            userDb.setEmail(userRequest.getEmail());
            userDb.setLastname(userRequest.getLastname());
            userDb.setName(userRequest.getName());
            userDb.setUsername(userRequest.getUsername());
            
            userDb.setRoles(getRoles(userRequest));
            return Optional.of(repository.save(userDb));
        }
        return Optional.empty();
    }

}
