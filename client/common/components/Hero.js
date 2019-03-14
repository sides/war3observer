import * as m from 'mithril';
import { getHeroLevelProgress } from '../utils/game';
import Component from '../Component';
import Icon from './Icon';
import Progress from './Progress';

export default class Hero extends Component {
  filterHeroAbilities(ability) {
    // Some item abilities and buffs have the hero prefix
    return !['AHer', 'ANpr', 'ANsa', 'ANss', 'ANse', 'ANbs', 'AUds', 'AEtr', 'AEsd'].includes(ability.id)
      && ability.id.match(/^A[HOEUN]/);
  }

  getXpFraction(percent) {
    if (app.settings.heroLevelPrecision <= 0) {
      return 0;
    }

    return Math.floor(percent * app.settings.heroLevelPrecision * 10) / (app.settings.heroLevelPrecision * 10) * 10;
  }

  view(vnode) {
    const hero = vnode.attrs.hero;

    // Abilities come in reverse order that they were trained, so
    // reverse them after filtering.
    const abilities = hero.abilities
      .filter(this.filterHeroAbilities)
      .reverse();

    const items = hero.inventory;

    const xpProgress = getHeroLevelProgress(hero);
    const xpFraction = this.getXpFraction(xpProgress);

    const Healthbar = vnode.attrs.healthComponent || Progress;
    const Manabar = vnode.attrs.manaComponent || Progress;
    const Experiencebar = vnode.attrs.experienceComponent || Progress;

    return (
      <div class={`Hero ${!hero.hitpoints ? 'Hero--dead' : ''}`} data-id={hero.id}>
        <div class="Hero-portrait">
          <Icon id={hero.id} class="Hero-icon" />
          <span class="Hero-level">
            {hero.level}
            {xpFraction > 0 ? (
              <span class="Level-fraction">.{xpFraction}</span>
            ) : null}
          </span>

          {vnode.attrs.showStatus ? (
            <div class="Hero-status">
              {vnode.attrs.showStatusExperience ? (
                <Experiencebar
                  type="status"
                  value={xpProgress} />
              ) : null}

              <Healthbar
                type="status"
                value={hero.hitpoints}
                max={hero.hitpoints_max} />

              <Manabar
                type="status"
                value={hero.mana}
                max={hero.mana_max} />
            </div>
          ) : null}
        </div>

        {vnode.attrs.showAbilities ? (
          <div class="Hero-abilities" data-amount={abilities.length}>
            {abilities.map(ability => (
              <div class="Hero-ability" data-id={ability.id}>
                <Icon id={ability.id} class="Ability-icon" />
                <span class="Ability-level">{ability.level}</span>
              </div>
            ))}
          </div>
        ) : null}

        {vnode.attrs.showItems ? (
          <div class="Hero-items" data-amount={items.length}>
            {items.map(item => (
              <div class="Hero-item" data-id={item.id}>
                <Icon id={item.id} class="Item-icon" />
                {item.charges > 0
                  ? <span class="Item-charges">{item.charges}</span>
                  : null
                }
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}
