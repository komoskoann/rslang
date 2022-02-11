import Control from '../../controls/control';
import html from './statistics.html';
import '../../css/statistics.css';
import GeneralStatisticsCard from './generalStatisticsCard';

export default class StatisticsSection extends Control {
  generalStatisticsCard: GeneralStatisticsCard;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'section', 'statistics-section');
    const pageTitleWrapper = new Control(this.node, 'div', 'book-text');
    new Control(pageTitleWrapper.node, 'h2', '', 'Статистика');
    new Control(pageTitleWrapper.node, 'h5', '', 'Ваша статистика за сегодня');
    const statisticsWrapper = new Control(this.node, 'div', 'statistics-wrapper');
    statisticsWrapper.node.innerHTML = html;
    this.renderGeneralStatsWrapper();
    this.navTabs();
  }

  renderGeneralStatsWrapper() {
    // console.log(this.node.querySelector('#general-stats').append())
    const generalStatsWrapper = this.node.querySelector('#general-stats') as HTMLElement;
    new GeneralStatisticsCard(generalStatsWrapper).render();


  }

  navTabs() {
    const tabs = this.node.querySelectorAll("ul.nav-tabs > li > a");
    const panes = this.node.querySelectorAll(".tab-pane");
    console.log(tabs,panes)
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

  makeInactive(items: HTMLCollection) {
    Object.keys(items).map((item)=> {
      items[+item].classList.remove("active");
    });
  }

  activateTab(e: Event) {
    const clickedTab = e.currentTarget as HTMLElement;
    clickedTab.classList.add("active");
  }

  activateTabContent(e: Event) {
    const anchorReference = e.target as HTMLElement;
    const activePaneID = anchorReference.getAttribute("href");
    const activePane = this.node.querySelector(activePaneID);
    activePane.classList.add("active");
  }

}
