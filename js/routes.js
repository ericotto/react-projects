import ReactHabitat from 'react-habitat';
import Markdown from '../markdown/Markdown';
import Leaderboard from '../leaderboard/Leaderboard';
import Recipes from '../recipes/Recipe';
import Schelling from '../schelling/Schelling';

class App extends ReactHabitat.Bootstrapper {
    constructor() {
        super();
        var container = new ReactHabitat.Container();
        container.register('Markdown', Markdown);
        container.register('Leaderboard', Leaderboard);
        container.register('Recipes', Recipes);
        container.register('Schelling', Schelling)
        this.setContainer(container);
    }
}

export default new App();