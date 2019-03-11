import * as m from 'mithril';
import Component from '../Component';
import Icon from './IconComponent';
import ProgressComponent from './ProgressComponent';

export default class HeroComponent extends Component {
  filterHeroAbilities(ability) {
    // Some item abilities have the hero prefix
    return !['AHer', 'ANpr', 'ANsa', 'ANss', 'ANse', 'ANbs', 'AUds'].includes(ability.id)
      && ability.id.match(/^A[HOEUN]/);
  }

  view(vnode) {
    const hero = vnode.attrs.hero;

    // Abilities come in reverse order that they were trained, so
    // reverse them after filtering.
    const abilities = hero.abilities
      .filter(this.filterHeroAbilities)
      .reverse();

    const items = hero.inventory;

    const healthComponent = vnode.attrs.healthComponent || ProgressComponent;
    const manaComponent = vnode.attrs.manaComponent || ProgressComponent;

    return (
      <div class={`Hero ${!hero.hitpoints ? 'Hero--dead' : ''}`} data-id={hero.id}>
        {vnode.attrs.showPortrait ? (
          <div class="Hero-portrait">
            <Icon id={hero.id} class="Hero-icon" />
            <span class="Hero-level">{hero.level}</span>
            {vnode.attrs.showStatus ? (
              <div class="Hero-status">
                {m(healthComponent, {
                  type: 'status',
                  value: hero.hitpoints,
                  max: hero.hitpoints_max
                })}

                {m(manaComponent, {
                  type: 'status',
                  value: hero.mana,
                  max: hero.mana_max
                })}
              </div>
            ) : null}
          </div>
        ) : null}

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
