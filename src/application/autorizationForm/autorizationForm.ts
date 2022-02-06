import Control from '../../controls/control';
import autorizationService from '../services/autorizationService/autorizationService/autorizationService';
import autorizationFormHTML from './autorizationForm.html';
import autorizationHTML from './autorizationComponent.html';
import registrationHTML from './registrationComponent.html';
import '../../css/autorizationForm.css';

export default class AuthorizationForm extends Control {
  private autorizationService: autorizationService;
  private openAuthorizationButton: HTMLButtonElement;
  private closeAutorizationButton: HTMLButtonElement;
  private submitButton: HTMLButtonElement;
  private changeComponentButton: HTMLButtonElement;
  private autorizationComponent: string;
  private registrationComponent: string;
  private inputEmail: HTMLInputElement;
  private inputPassword: HTMLInputElement;
  private inputName: HTMLInputElement;
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'form', 'authorizationForm', '');
    this.openAuthorizationButton = this.searchOpenAuthorizationButton();
    this.openAuthorizationButton.addEventListener('click', this.openAuthorizationForm);
    this.node.innerHTML = autorizationFormHTML;
    this.autorizationComponent = autorizationHTML;
    this.registrationComponent = registrationHTML;
    this.autorizationService = new autorizationService();
  }
  private searchOpenAuthorizationButton = (): HTMLButtonElement => document.querySelector('.login');
  private searchCloseAuthorizationButton = (): HTMLButtonElement => document.querySelector('.authorizationForm__closeButton');
  private openAuthorizationForm = (): void => {
    this.node.classList.add('active');
    this.node.firstElementChild.firstElementChild.innerHTML = this.autorizationComponent;
    this.submitButton = this.node.querySelector('.button-signin');
    this.closeAutorizationButton = this.searchCloseAuthorizationButton();
    this.changeComponentButton = this.node.querySelector('.button-changeComponent');
    this.submitButton.addEventListener('click', this.signInAction);
    this.changeComponentButton.addEventListener('click', this.openRegistationComponent);
    window.addEventListener('click', this.checkMouseclick);
    this.inputEmail = document.getElementById('authorizationFormInputEmail') as HTMLInputElement;
    this.inputPassword = document.getElementById('authorizationFormInputPassword') as HTMLInputElement;
    this.inputEmail.addEventListener('input', this.activateSubmitButton);
    this.inputPassword.addEventListener('input', this.activateSubmitButton);
  }
  private checkEmail = (): boolean => /\S+@\S+\.\S+/.test(this.inputEmail.value);
  private checkPassword = (): boolean => this.inputPassword.value.length >= 8;
  private checkName = (): boolean => this.inputName.value.length >= 3 ? true : false;
  private checkInputs = (): boolean => {
    if (this.inputEmail?.value.length > 0) {
      this.checkEmail() === true ?
      (this.inputEmail.parentElement as HTMLElement).setAttribute('data-after', '') :
      (this.inputEmail.parentElement as HTMLElement).setAttribute('data-after', 'Email должен быть формата email@example.com');
    }
    if (this.inputPassword.value.length > 0) {
      this.checkPassword() === true ?
      (this.inputPassword.parentElement as HTMLElement).setAttribute('data-after', '') :
      (this.inputPassword.parentElement as HTMLElement).setAttribute('data-after', 'Пароль должен содержать более восьми символов');
    }
    if (this.inputName?.value.length > 0) {
      this.checkName() === true ?
      (this.inputName.parentElement as HTMLElement).setAttribute('data-after', '') :
      (this.inputName.parentElement as HTMLElement).setAttribute('data-after', 'Имя должно содержать более трех символов');
    }
    return this.inputName ?
    [this.checkEmail(), this.checkPassword(), this.checkName()].every(item => item === true) :
    [this.checkEmail(), this.checkPassword()].every(item => item === true);
  }
  private activateSubmitButton = (): void => {
    this.checkInputs() ? this.submitButton.disabled = false : this.submitButton.disabled = true;
  }
  private closeAuthorizationForm(): void {
    this.node.classList.remove('active');
    window.removeEventListener('click', this.checkMouseclick);
  }
  private checkMouseclick = (e: MouseEvent): void => {
    const item = e.target as HTMLElement;
    if (item == this.closeAutorizationButton || (!item.closest('.authorizationForm') && !item.closest('.login') && !item.closest('.button-changeComponent'))) {
      this.closeAuthorizationForm();
    }
  }
  private openRegistationComponent = (e: Event): void => {
    e.preventDefault();
    const form = document.querySelector('.authorizationForm') as HTMLElement;
    form.firstElementChild.firstElementChild.innerHTML = this.registrationComponent;
    this.submitButton = this.node.querySelector('.button-signup');
    this.changeComponentButton = this.node.querySelector('.button-changeComponent');
    this.submitButton.addEventListener('click', this.signUpAction);
    this.changeComponentButton.addEventListener('click', this.openAuthorizationComponent);
    this.inputEmail = document.getElementById('authorizationFormInputEmail') as HTMLInputElement;
    this.inputPassword = document.getElementById('authorizationFormInputPassword') as HTMLInputElement;
    this.inputName = document.getElementById('authorizationFormInputName') as HTMLInputElement;
    this.inputEmail.addEventListener('input', this.activateSubmitButton);
    this.inputPassword.addEventListener('input', this.activateSubmitButton);
    this.inputName.addEventListener('input', this.activateSubmitButton);
  }
  private openAuthorizationComponent = (e: Event): void => {
    e.preventDefault();
    const form = document.querySelector('.authorizationForm') as HTMLElement;
    form.firstElementChild.firstElementChild.innerHTML = this.autorizationComponent;
    this.submitButton = this.node.querySelector('.button-signin');
    this.changeComponentButton = this.node.querySelector('.button-changeComponent');
    this.submitButton.addEventListener('click', this.signInAction);
    this.changeComponentButton.addEventListener('click', this.openRegistationComponent);
    this.inputEmail = document.getElementById('authorizationFormInputEmail') as HTMLInputElement;
    this.inputPassword = document.getElementById('authorizationFormInputPassword') as HTMLInputElement;
    this.inputEmail.addEventListener('input', this.activateSubmitButton);
    this.inputPassword.addEventListener('input', this.activateSubmitButton);
  }
  private signInAction = async (e: Event): Promise<void> =>{
    e.preventDefault();
    this.checkInputs();
    const email = (document.getElementById('authorizationFormInputEmail') as HTMLInputElement).value;
    const password = (document.getElementById('authorizationFormInputPassword') as HTMLInputElement).value;
    const response = await this.autorizationService.signInUserRequest({email, password});
    if (response.status === 200) {
      this.openAuthorizationButton.innerHTML = 'Выйти';
      const content = await response.json();
      this.closeAuthorizationForm();
      console.log(content);
    }
  }
  private signUpAction = async (e: Event): Promise<void> => {
    e.preventDefault();
    const name = (document.getElementById('authorizationFormInputName') as HTMLInputElement).value;
    const email = (document.getElementById('authorizationFormInputEmail') as HTMLInputElement).value;
    const password = (document.getElementById('authorizationFormInputPassword') as HTMLInputElement).value;
    const response = await this.autorizationService.signUpUserRequest({email, password, name});
    if (response.status === 200) {
      const content = await response.json();
      console.log(content);
      this.signInAction(e);
    }
  }
}
