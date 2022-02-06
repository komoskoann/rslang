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
  private signInButton: HTMLButtonElement;
  private signUpButton: HTMLButtonElement;
  private changeComponentButton: HTMLButtonElement;
  private autorizationComponent: string;
  private registrationComponent: string;
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'form', 'authorizationForm', '');
    this.openAuthorizationButton = this.searchOpenAuthorizationButton();
    this.openAuthorizationButton.addEventListener('click', this.openAuthorizationForm);
    this.closeAutorizationButton = this.searchCloseAuthorizationButton(this.node);
    this.node.innerHTML = autorizationFormHTML;
    this.autorizationComponent = autorizationHTML;
    this.registrationComponent = registrationHTML;
    this.autorizationService = new autorizationService();
  }
  private searchOpenAuthorizationButton = (): HTMLButtonElement => document.querySelector('.login');
  private searchCloseAuthorizationButton = (form: HTMLElement): HTMLButtonElement => form.querySelector('.authorizationForm__closeButton');
  private openAuthorizationForm = (): void => {
    this.node.classList.add('active');
    this.node.firstElementChild.firstElementChild.innerHTML = this.autorizationComponent;
    this.signInButton = this.node.querySelector('.button-signin');
    this.changeComponentButton = this.node.querySelector('.button-changeComponent');
    this.signInButton.addEventListener('click', this.signInAction);
    this.changeComponentButton.addEventListener('click', this.openRegistationComponent);
    window.addEventListener('click', this.checkMouseclick);
  }
  private closeAuthorizationForm(): void {
    this.node.classList.remove('active');
    window.removeEventListener('click', this.checkMouseclick);
  }
  private checkMouseclick = (e: MouseEvent): void => {
    const item = e.target as HTMLElement;
    if (item.closest('.authorizationForm__closeButton') || (!item.closest('.authorizationForm') && !item.closest('.login') && !item.closest('.button-changeComponent'))) {
      this.closeAuthorizationForm();
    }
  }
  private openRegistationComponent = (e: Event): void => {
    this.signInButton.removeEventListener('click', this.signInAction);
    this.changeComponentButton.removeEventListener('click', this.openRegistationComponent);
    e.preventDefault();
    const form = document.querySelector('.authorizationForm') as HTMLElement;
    form.firstElementChild.firstElementChild.innerHTML = this.registrationComponent;
    this.signUpButton = this.node.querySelector('.button-signup');
    this.changeComponentButton = this.node.querySelector('.button-changeComponent');
    this.signUpButton.addEventListener('click', this.signUpAction);
    this.changeComponentButton.addEventListener('click', this.openAuthorizationForm);
  }
  private openAuthorizationComponent = (e: Event): void => {
    e.preventDefault();
    this.signUpButton.removeEventListener('click', this.signInAction);
    this.changeComponentButton.removeEventListener('click', this.openAuthorizationForm);
    const form = document.querySelector('.authorizationForm') as HTMLElement;
    form.firstElementChild.firstElementChild.innerHTML = this.autorizationComponent;
    this.signInButton = this.node.querySelector('.button-signin');
    this.changeComponentButton = this.node.querySelector('.button-changeComponent');
    this.signInButton.addEventListener('click', this.signInAction);
    this.changeComponentButton.addEventListener('click', this.openRegistationComponent);
  }
  private signInAction = async (e: Event): Promise<void> =>{
    e.preventDefault();
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
