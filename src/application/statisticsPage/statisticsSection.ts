import Control from '../../controls/control';
import html from './statistics.html';
import '../../css/statistics.css';
import StatisticsCard from './StatisticsCard';
import { IStatistics } from './IStatistics';
import Statistics from '../services/statistics/statistics';

export default class StatisticsSection extends Control {
  private statisticsService: Statistics = new Statistics();

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'statistics-section');
    this.render();
    this.navTabs();
  }

  private getUserId(): string {
    return JSON.parse(localStorage.getItem('currentUser')).userId;
  }

  private getUserToken(): string {
    return JSON.parse(localStorage.getItem('currentUser')).token;
  }

  private render(): void {
    this.renderPageTitleWrapper();
    const statisticsWrapper = new Control(this.node, 'div', 'statistics-wrapper');
    if (!JSON.parse(localStorage.getItem('currentUser'))) {
      statisticsWrapper.node.innerHTML = 'Только авторизированные пользователи могут просматривать статистику!';
      statisticsWrapper.node.classList.add('statistics-warning');
    } else {
      statisticsWrapper.node.innerHTML = html;
      this.renderGeneralStatsWrapper();
      this.renderSprintStatsWrapper();
      this.renderAudioChallengeStatsWrapper();
    }
  }

  private renderPageTitleWrapper(): void {
    const pageTitleWrapper = new Control(this.node, 'div', 'book-text');
    new Control(pageTitleWrapper.node, 'h2', '', 'Статистика');
    new Control(pageTitleWrapper.node, 'h5', '', 'Ваша статистика за сегодня');
  }

  private async renderGeneralStatsWrapper(): Promise<void> {
    const generalStatsWrapper = this.node.querySelector('#general-stats') as HTMLElement;
    try {
      const stats: IStatistics = await this.statisticsService.getStatistics(this.getUserId(), this.getUserToken());
      const newWords =
        stats.optional.gameStatistics.audioChallenge.newWords + stats.optional.gameStatistics.sprint.newWords;
      const learnedWords = stats.learnedWords;
      const wrongAnswers =
        stats.optional.gameStatistics.audioChallenge.wrongAnswers + stats.optional.gameStatistics.sprint.wrongAnswers;
      const correctAnswers =
        stats.optional.gameStatistics.audioChallenge.correctAnswers +
        stats.optional.gameStatistics.sprint.correctAnswers;
      const totalAnswers = wrongAnswers + correctAnswers;
      new StatisticsCard(
        generalStatsWrapper,
        correctAnswers,
        totalAnswers,
        newWords,
        learnedWords,
        'words-stats',
        'pie-stats',
      ).render();
    } catch {
      new StatisticsCard(generalStatsWrapper, 0, 1, 0, 0, 'words-stats', 'pie-stats').render();
    }
    this.node.querySelector('.bar-legend').textContent = 'Изученные слова';
  }

  private async renderSprintStatsWrapper(): Promise<void> {
    const sprintStatsWrapper = this.node.querySelector('#sprint-stats') as HTMLElement;
    try {
      const stats: IStatistics = await this.statisticsService.getStatistics(this.getUserId(), this.getUserToken());
      const newWords = stats.optional.gameStatistics.sprint.newWords;
      const longestSeries = stats.optional.gameStatistics.sprint.longestSeries;
      const wrongAnswers = stats.optional.gameStatistics.sprint.wrongAnswers;
      const correctAnswers = stats.optional.gameStatistics.sprint.correctAnswers;
      const totalAnswers = wrongAnswers + correctAnswers;
      new StatisticsCard(
        sprintStatsWrapper,
        correctAnswers,
        totalAnswers,
        newWords,
        longestSeries,
        'words-stats-sprint',
        'pie-stats-sprint',
      ).render();
    } catch {
      new StatisticsCard(sprintStatsWrapper, 0, 1, 0, 0, 'words-stats-sprint', 'pie-stats-sprint').render();
    }
  }

  private async renderAudioChallengeStatsWrapper(): Promise<void> {
    const audioChallengeStatsWrapper = this.node.querySelector('#audioChallenge-stats') as HTMLElement;
    try {
      const stats: IStatistics = await this.statisticsService.getStatistics(this.getUserId(), this.getUserToken());
      const newWords = stats.optional.gameStatistics.audioChallenge.newWords;
      const longestSeries = stats.optional.gameStatistics.audioChallenge.longestSeries;
      const wrongAnswers = stats.optional.gameStatistics.audioChallenge.wrongAnswers;
      const correctAnswers = stats.optional.gameStatistics.audioChallenge.correctAnswers;
      const totalAnswers = wrongAnswers + correctAnswers;
      new StatisticsCard(
        audioChallengeStatsWrapper,
        correctAnswers,
        totalAnswers,
        newWords,
        longestSeries,
        'words-stats-audio',
        'pie-stats-audio',
      ).render();
    } catch {
      new StatisticsCard(audioChallengeStatsWrapper, 0, 1, 0, 0, 'words-stats-audio', 'pie-stats-audio').render();
    }
  }

  private navTabs(): void {
    const tabs = this.node.querySelectorAll('ul.nav-tabs > li > a');
    const panes = this.node.querySelectorAll('.tab-pane');
    Object.keys(tabs).map((tab) => {
      tabs[+tab].addEventListener('click', (e: Event) => {
        this.makeInactive(tabs);
        this.activateTab(e);
        this.makeInactive(panes);
        this.activateTabContent(e);
        e.preventDefault();
      });
    });
  }

  private makeInactive(items: NodeListOf<Element>): void {
    Object.keys(items).map((item) => {
      items[+item].classList.remove('active');
    });
  }

  private activateTab(e: Event): void {
    const clickedTab = e.currentTarget as HTMLElement;
    clickedTab.classList.add('active');
  }

  private activateTabContent(e: Event): void {
    const anchorReference = e.target as HTMLElement;
    const activePaneID = anchorReference.getAttribute('href');
    const activePane = this.node.querySelector(activePaneID);
    activePane.classList.add('active');
  }
}
