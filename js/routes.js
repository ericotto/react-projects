import ReactHabitat from 'react-habitat';
import Markdown from '../markdown/Markdown';
import Leaderboard from '../leaderboard/Leaderboard';

class App extends ReactHabitat.Bootstrapper {
    constructor() {
        super();
        var container = new ReactHabitat.Container();
        container.register('Markdown', Markdown);
        container.register('Leaderboard', Leaderboard);
        this.setContainer(container);
    }
}

export default new App();