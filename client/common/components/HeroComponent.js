import * as m from 'mithril';
import Component from '../Component';
import Icon from './IconComponent';

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

    return (
      <div class={`Hero ${!hero.hitpoints ? 'Hero--dead' : ''}`} data-id={hero.id}>
        <div class="Hero-portrait">
          <Icon id={hero.id} class="Hero-icon" />
          <span class="Hero-level">{hero.level}</span>
        </div>

        <div class="Hero-abilities" data-amount={abilities.length}>
          {abilities.map(ability => (
            <div class="Hero-ability" data-id={ability.id}>
              <Icon id={ability.id} class="Ability-icon" />
              <span class="Ability-level">{ability.level}</span>
            </div>
          ))}
        </div>

        <div class="Hero-items" data-amount={items.length}>
          {items.map(item => (
            <div class="Hero-item" data-id={item.id}>
              <Icon id={item.id} class="Item-icon" />
              {item.charges > 0
                ? <span class="Item-charges">{item.charges}</span>
                : ''
              }
            </div>
          ))}
        </div>
      </div>
    );
  }
}
