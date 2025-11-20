package com.example.user_account_service.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.user_account_service.service.userService;
import com.example.user_account_service.service.accountService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.user_account_service.model.user;
import com.example.user_account_service.model.account;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class userAccountController {
    
    private final userService userService;
    private final accountService accountService;

    public userAccountController(userService userService, accountService accountService) {
        this.userService = userService;
        this.accountService = accountService;
    }

    //User - POST new User
    @PostMapping("")
    public ResponseEntity<user> createUser(@RequestBody user user){
        return ResponseEntity.ok(userService.createUser(user));
    }

    //User - GET all User
    @GetMapping("")
    public ResponseEntity<List<user>> getUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }

    //User - GET user of Self
    @GetMapping("/{id}")  
    public ResponseEntity<Optional<user>> getUserById(@PathVariable long id) {
        return ResponseEntity.ok(userService.getUserSelf(id));
    }

    //User - PUT current User
    @PutMapping("/{id}")
    public ResponseEntity<user> updateUser(@PathVariable long id, @RequestBody user user) {
        return ResponseEntity.ok(userService.updateUser(user, id));
    }

    //User - DELETE current User
    @DeleteMapping("/{id}")
    public ResponseEntity<user> deleteUser(@PathVariable long id, @RequestBody user user) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    //Account - POST new bank account from User
    @PostMapping("/{id}/accounts")
    public ResponseEntity<account> createAccount(@PathVariable long id, @RequestBody account account) {
        return ResponseEntity.ok(accountService.createAccount(id, account));
    }

    //Account - GET all bank account created by User
    @GetMapping("/{id}/accounts")
    public ResponseEntity<Object> getAccount(@PathVariable long id) {
        return ResponseEntity.ok(accountService.findByUserId(id));
    }    

    //Account - DELETE bank account by account id
    @DeleteMapping("/{id}/accounts/{accountId}")
    public ResponseEntity<account> deleteAccount(@PathVariable long id, @PathVariable long accountId) {
        accountService.deleteAccount(accountId);
        return ResponseEntity.noContent().build();
    }
    
}
