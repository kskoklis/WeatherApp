import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  onSignup(form: NgForm){
    if (form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.username, form.value.email, form.value.password);
  }
}
