import Control from '../../controls/control';
import AutorizationService from '../services/autorizationService/autorizationService/autorizationService';
import autorizationFormHTML from './autorizationForm.html';
import autorizationHTML from './autorizationComponent.html';
import registrationHTML from './registrationComponent.html';
import Avatar from '../mainPage/avatar';
import '../../css/autorizationForm.css';
import { app } from '../..';

export default class AuthorizationForm extends Control {
  private autorizationService: AutorizationService;

  private openAuthorizationButton: HTMLButtonElement;

  private closeAutorizationButton: HTMLButtonElement;

  private submitButton: HTMLButtonElement;

  private changeComponentButton: HTMLButtonElement;

  private autorizationComponent: string;

  private registrationComponent: string;

  private inputEmail: HTMLInputElement;

  private inputPassword: HTMLInputElement;

  private inputName: HTMLInputElement;

  private avatar: Avatar;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'form', 'authorizationForm', '');
    this.openAuthorizationButton = this.searchOpenAuthorizationButton();
    this.openAuthorizationButton.textContent =
      JSON.parse(localStorage.getItem('currentUser'))?.message === 'Authenticated' ? 'Выйти' : 'Войти';
    this.openAuthorizationButton.addEventListener('click', this.openAuthorizationForm);
    this.node.innerHTML = autorizationFormHTML;
    this.autorizationComponent = autorizationHTML;
    this.registrationComponent = registrationHTML;
    this.autorizationService = new AutorizationService();
    this.addAvatar();
  }

  private addAvatar() {
    if (JSON.parse(localStorage.getItem('currentUser')) && !document.querySelector('.avatar-img')) {
      this.avatar = new Avatar(
        document.querySelector('.authorizationWrapper'),
        JSON.parse(localStorage.getItem('currentUser'))?.name[0],
      );
    }
  }

  private searchOpenAuthorizationButton = (): HTMLButtonElement => document.querySelector('.login');

  private searchCloseAuthorizationButton = (): HTMLButtonElement =>
    document.querySelector('.authorizationForm__closeButton');

  private openAuthorizationForm = (): void => {
    if (app.currentUser.isAuthenticated) {
      localStorage.removeItem('currentUser');
      app.currentUser.signOut();
      this.openAuthorizationButton.textContent = 'Войти';
      this.avatar.destroy();
      this.showSignOutAlert();
      this.hideOptionsFromUnauthorized();
      return;
    }
    this.closeAutorizationButton = this.searchCloseAuthorizationButton();
    this.node.classList.add('active');
    window.addEventListener('click', this.checkMouseclick);
    this.openAuthorizationComponent();
  };

  private checkEmail = (): boolean => /\S+@\S+\.\S+/.test(this.inputEmail.value);

  private checkPassword = (): boolean => this.inputPassword.value.length >= 8;

  private checkName = (): boolean => (this.inputName.value.length >= 3 ? true : false);

  private checkInput = (input: HTMLInputElement, func: Function, mistake: string): void => {
    if (func()) {
      (input.parentElement as HTMLElement).setAttribute('data-after', '');
    } else {
      (input.parentElement as HTMLElement).setAttribute('data-after', mistake);
    }
  };

  private checkAllInputs = (): boolean => {
    if (this.inputEmail.value.length) {
      this.checkInput(this.inputEmail, this.checkEmail, 'Email должен быть формата email@example.com');
    }
    if (this.inputPassword.value.length) {
      this.checkInput(this.inputPassword, this.checkPassword, 'Пароль должен содержать более восьми символов');
    }
    if (this.inputName?.value.length) {
      this.checkInput(this.inputName, this.checkName, 'Имя должно содержать более трех символов');
    }
    return this.checkEmail() && this.checkPassword() && (this.inputName ? this.checkName() : true);
  };

  private activateSubmitButton = (): void => {
    if (this.checkAllInputs()) {
      this.submitButton.disabled = false;
    } else this.submitButton.disabled = true;
  };

  private closeAuthorizationForm(): void {
    this.node.classList.remove('active');
    window.removeEventListener('click', this.checkMouseclick);
  }

  private checkMouseclick = (e: MouseEvent): void => {
    const item = e.target as HTMLElement;
    if (
      item == this.closeAutorizationButton ||
      (!item.closest('.authorizationForm') && !item.closest('.login') && !item.closest('.button-changeComponent'))
    ) {
      this.closeAuthorizationForm();
    }
  };

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
  };

  private openAuthorizationComponent = (e?: Event): void => {
    e?.preventDefault();
    this.node.firstElementChild.firstElementChild.innerHTML = this.autorizationComponent;
    this.submitButton = this.node.querySelector('.button-signin');
    this.changeComponentButton = this.node.querySelector('.button-changeComponent');
    this.submitButton.addEventListener('click', this.signInAction);
    this.changeComponentButton.addEventListener('click', this.openRegistationComponent);
    this.inputEmail = document.getElementById('authorizationFormInputEmail') as HTMLInputElement;
    this.inputPassword = document.getElementById('authorizationFormInputPassword') as HTMLInputElement;
    this.inputEmail.addEventListener('input', this.activateSubmitButton);
    this.inputPassword.addEventListener('input', this.activateSubmitButton);
  };

  private signInAction = async (e: Event): Promise<void> => {
    e.preventDefault();
    const email = (document.getElementById('authorizationFormInputEmail') as HTMLInputElement).value;
    const password = (document.getElementById('authorizationFormInputPassword') as HTMLInputElement).value;
    const response = await this.autorizationService.signIn({ email, password });
    if (response.status === 200) {
      this.openAuthorizationButton.innerHTML = 'Выйти';
      const content = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(content));
      [
        app.currentUser.isAuthenticated,
        app.currentUser.token,
        app.currentUser.refreshToken,
        app.currentUser.userId,
        app.currentUser.name,
      ] = [content.message === 'Authenticated', content.token, content.refreshToken, content.userId, content.name];
      this.closeAuthorizationForm();
      console.log(content);
      this.addAvatar();
      this.showOptionsForAuthorized();
      this.showSignInAlert();
    }
  };

  private signUpAction = async (e: Event): Promise<void> => {
    e.preventDefault();
    let name = (document.getElementById('authorizationFormInputName') as HTMLInputElement).value
      .split(' ')
      .map((item) => item.slice(0, 1).toUpperCase() + item.slice(1))
      .join(' ');
    const email = (document.getElementById('authorizationFormInputEmail') as HTMLInputElement).value;
    const password = (document.getElementById('authorizationFormInputPassword') as HTMLInputElement).value;
    const response = await this.autorizationService.signUp({ email, password, name });
    if (response.status === 200) {
      const content = await response.json();
      console.log(content);
      this.signInAction(e);
    }
  };

  private showSignInAlert() {
    const popupsContainer = new Control(document.body, 'div', 'alert alert-info');
    popupsContainer.node.innerHTML = 'Авторизация прошла успешно';
    setTimeout(function(){
        popupsContainer.node.remove();
      }, 1300);
  }

  private showSignOutAlert() {
    const popupsContainer = new Control(document.body, 'div', 'alert alert-info');
    popupsContainer.node.innerHTML = 'Вы больше не авторизованы';
    setTimeout(function(){
        popupsContainer.node.remove();
      }, 1300);
  }

  private hideOptionsFromUnauthorized() {
    document.querySelectorAll('.control-buttons-wrapper').forEach(button => button.setAttribute('style', 'display: none'));
    document.querySelector('.hard-word-cont')?.setAttribute('style', 'display: none');
  }

  private showOptionsForAuthorized() {
    document.querySelectorAll('.control-buttons-wrapper').forEach(button => button.setAttribute('style', 'display: flex'));
    document.querySelector('.hard-word-cont')?.setAttribute('style', 'display: flex');
  }
}
