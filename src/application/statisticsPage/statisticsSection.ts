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

  render(): void {
    this.renderPageTitleWrapper();
    const statisticsWrapper = new Control(this.node, 'div', 'statistics-wrapper');
    statisticsWrapper.node.innerHTML = html;
    this.renderGeneralStatsWrapper();
    this.renderSprintStatsWrapper();
    this.renderAudioChallengeStatsWrapper();
  }

  renderPageTitleWrapper(): void {
    const pageTitleWrapper = new Control(this.node, 'div', 'book-text');
    new Control(pageTitleWrapper.node, 'h2', '', 'Статистика');
    new Control(pageTitleWrapper.node, 'h5', '', 'Ваша статистика за сегодня');
  }

  async renderGeneralStatsWrapper(): Promise<void> {
    const generalStatsWrapper = this.node.querySelector('#general-stats') as HTMLElement;
    const statisticsData = {
      learnedWords: 10,
      optional: {
        gameStatistics: {
          sprint: {
            newWords: 5,
            learnedWords: 7,
            correctAnswers: 6,
            wrongAnswers: 1,
            longestSeries: 4,
          },
          audioChallenge: {
            newWords: 8,
            learnedWords: 3,
            correctAnswers: 9,
            wrongAnswers: 4,
            longestSeries: 6,
          },
        },
      },
    }
    await this.statisticsService.putStatistics(this.getUserId(), this.getUserToken(), statisticsData);
    const stats: IStatistics = await this.statisticsService.getStatistics(this.getUserId(), this.getUserToken());
    new StatisticsCard(generalStatsWrapper, 10, 18, 3, 7, 'words-stats', 'pie-stats').render();
  }

  renderSprintStatsWrapper(): void {
    const sprintStatsWrapper = this.node.querySelector('#sprint-stats') as HTMLElement;
    new StatisticsCard(sprintStatsWrapper, 5, 8, 3, 7, 'words-stats-sprint', 'pie-stats-sprint').render();
  }

  renderAudioChallengeStatsWrapper(): void {
    const audioChallengeStatsWrapper = this.node.querySelector('#audioChallenge-stats') as HTMLElement;
    new StatisticsCard(audioChallengeStatsWrapper, 9, 15, 40, 33, 'words-stats-audio', 'pie-stats-audio').render();
  }

  navTabs(): void {
    const tabs = this.node.querySelectorAll("ul.nav-tabs > li > a");
    const panes = this.node.querySelectorAll(".tab-pane");
    Object.keys(tabs).map((tab) => {
      tabs[+tab].addEventListener("click", (e: Event)=> {
        this.makeInactive(tabs);
        this.activateTab(e);
        this.makeInactive(panes);
        this.activateTabContent(e);
        e.preventDefault();
      });
    });
  }

  makeInactive(items: NodeListOf<Element>): void {
    Object.keys(items).map((item)=> {
      items[+item].classList.remove("active");
    });
  }

  activateTab(e: Event): void {
    const clickedTab = e.currentTarget as HTMLElement;
    clickedTab.classList.add("active");
  }

  activateTabContent(e: Event): void {
    const anchorReference = e.target as HTMLElement;
    const activePaneID = anchorReference.getAttribute("href");
    const activePane = this.node.querySelector(activePaneID);
    activePane.classList.add("active");
  }

}
