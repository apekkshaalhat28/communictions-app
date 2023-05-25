import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-communication-form',
  templateUrl: './communication-form.component.html',
  styleUrls: ['./communication-form.component.css']
})
export class CommunicationFormComponent {
  communicationForm: FormGroup;
  isLinkInvalid: boolean = false;
  isCustomerNameInvalid: boolean = false;
  isMobileNoInvalid: boolean = false;
  isEmailInvalid: boolean = false;
  isLanNoInvalid: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  isLoading: boolean= false;

  constructor(private http: HttpClient) {
    this.communicationForm = new FormGroup({
      link: new FormControl('', [Validators.required, Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)]),
      customerName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]{1,100}$/)]),
      mobileNo: new FormControl('', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      lanNo: new FormControl('', [Validators.required, Validators.maxLength(16)])
    });
  
    this.communicationForm.get('link')?.valueChanges.pipe(
      debounceTime(300) // Debounce time in milliseconds
    ).subscribe(() => {
      const linkControl = this.communicationForm.get('link');
      this.isLinkInvalid = linkControl ? (linkControl.invalid && linkControl.touched) : false;
    });

    
    this.communicationForm.get('customerName')?.valueChanges.pipe(
      debounceTime(300000)
    ).subscribe(() => {
      const customerNameControl = this.communicationForm.get('customerName');
      this.isCustomerNameInvalid = customerNameControl ? (customerNameControl.invalid && customerNameControl.touched) : false;
    });

    this.communicationForm.get('mobileNo')?.valueChanges.pipe(
      debounceTime(300000),  distinctUntilChanged()
    ).subscribe(() => {
      const mobileNoControl = this.communicationForm.get('mobileNo');
      this.isMobileNoInvalid = mobileNoControl ? (mobileNoControl.invalid && mobileNoControl.touched) : false;
    });

    this.communicationForm.get('email')?.valueChanges.pipe(
      debounceTime(300000),  distinctUntilChanged()
    ).subscribe(() => {
      const emailControl = this.communicationForm.get('email');
      this.isEmailInvalid = emailControl ? (emailControl.invalid && emailControl.touched) : false;
    });

      this.communicationForm.get('lanNo')?.valueChanges.pipe(
      debounceTime(300000)
    ).subscribe(() => {
      const lanNoControl = this.communicationForm.get('lanNo');
      this.isLanNoInvalid = lanNoControl ? (lanNoControl.invalid && lanNoControl.touched) : false;
    });
}

  submitForm() {
    this.isLoading = true;
    this.communicationForm.disable();

    // Set the request headers
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Make the POST request
    this.http.post('https://sendemail.free.beeceptor.com/sendCommuncation', this.communicationForm.value, { headers })
      .subscribe(
        (response: any) => {
          // Handle the response
          this.showPopup = true;
          this.popupMessage = 'Communication has been sent!';
          this.communicationForm.reset();
          this.isLoading = false;
          this.communicationForm.enable();
        },
        (error: any) => {
          console.error('Error sending communication:', error);
          this.isLoading = false;
          this.communicationForm.enable();
        }
      );
  }

  closePopup() {
        this.showPopup = false;
        this.popupMessage = '';
      }
}
