package com.example.user_account_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.user_account_service.model.account;
import com.example.user_account_service.model.user;
import com.example.user_account_service.repository.accountRepository;
import com.example.user_account_service.repository.userRepository;

import java.util.List;
import java.util.Random;

@Service
public class accountService {
    
    @Autowired
    private accountRepository accountRepository;

    @Autowired
    private userRepository userRepository;

    public account createAccount(long id, account account){
        
        user user = userRepository.findById(id).orElseThrow(() ->
            new RuntimeException("User not found with id: " + id)
        );

        // IMPORTANT: set the owning side of the relationship
        account.setUser(user);

        // Generate unique account number
        Random rand = new Random();
        String accountNumber;
        do {
            accountNumber = String.format("%04d %04d %04d",
                rand.nextInt(10000),
                rand.nextInt(10000),
                rand.nextInt(10000));
        } while (accountRepository.existsByAccountNumber(accountNumber));

        account.setAccountNumber(accountNumber);
        
        // Save the account (owning side)
        account savedAccount = accountRepository.save(account);

        // Update in-memory relationship and persist
        user.getAccounts().add(savedAccount);
        userRepository.save(user);

        return savedAccount;
    }

    //GET all accounts owned by user
    public List<account> getAccountbyId(long id){
        return accountRepository.findByUserId(id);
        
    }

    //DELETE account by account id
    public void deleteAccount(long id){
        if(!accountRepository.existsById(id)){
            throw new RuntimeException("Account not found with id: " + id);
        }
        
        accountRepository.deleteById(id);
    }

	public Object findByUserId(long id) {
        return accountRepository.findByUserId(id);
	}
        
}
