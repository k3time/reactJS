import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as _ from 'underscore';

const data = [
    {
        "name": "Mark Twain",
        "imageURL": "app/dist/images/Mark_Twain.jpg",
        "books": ['The Adventures of Huckelberry Finn']
    },
    {
        "name": "Joseph Conrad",
        "imageURL": "app/dist/images/Joseph_Conrad.jpg",
        "books": ['Heart of Darkness']
    },
    {
        "name": "J. K. Rowling",
        "imageURL": "app/dist/images/J_K_Rowling.jpg",
        "books": ['Harry Potter and the Sorcerers Stone']
    },
    {
        "name": "Stephen King",
        "imageURL": "app/dist/images/Stephen_King.jpg",
        "books": ['The Shining', 'IT']
    },
    {
        "name": "Charkles Dickens",
        "imageURL": "app/dist/images/Charles_Dickens.jpg",
        "books": ['David Copperfield', 'A Tale of Two Cities']
    },
    {
        "name": "William Shakespeare",
        "imageURL": "app/dist/images/William_Shakespeare.jpg",
        "books": ['Hamlet', 'Macbeth', 'Romeo and Juliet']
    }
];

var selectGame = function () {
    var books = _.shuffle(this.reduce(function (p, c, i) {
        return p.concat(c.books);
    }, [])).slice(0, 4);

    var answer = books[_.random(books.length - 1)];

    return {
        books: books,
        author: _.find(this, function (item) {
            return item.books.some(function (title) {
                return title === answer;
            });
        }),
        checkAnswer(title) {
            return this.author.books.some(function (t) {
                return t === title;
            });
        }
    };
};

data.selectGame = selectGame;

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = _.extend({
            bgClass: 'neutral',
            showContinue: false
        }, this.props.data.selectGame());
        this.handleBookSelected = this.handleBookSelected.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
        this.handleAddGame = this.handleAddGame.bind(this);
    }
    handleBookSelected(title) {
        var isCorrect = this.state.checkAnswer(title);
        this.setState({
            bgClass: isCorrect ? 'pass' : 'fail',
            showContinue: isCorrect
        });
    }
    handleContinue() {
        this.setState(_.extend({
            bgClass: 'neutral',
            showContinue: false
        }, this.props.data.selectGame()));
    }
    handleAddGame() {
        routie('addGame');
    }
    render() {
        return (<div>
            <div className="row m-b-medium">
                <div className="col-md-3">
                    <figure className="figure author">
                        <img src={this.state.author.imageURL} className="figure-img img-thumbnail img-fluid" alt="A generic square placeholder image with rounded corners in a figure." />
                        <figcaption className="figure-caption">{this.state.author.name}</figcaption>
                    </figure>
                </div>
                <div className="col-md-7">
                    {
                        this.state.books.map((b, i) => {
                            return <Book onBookSelected={this.handleBookSelected} title={b} key={i} />;
                        }, this)
                    }
                </div>
                <div className={"col-md-2 " + this.state.bgClass}></div>
            </div>
            {
                this.state.showContinue
                    ?
                    (
                        <div className="row m-b-medium">
                            <div className="col-md-12 text-right">
                                < input type="button" className="btn btn-success" value="Continue" onClick={this.handleContinue} />
                            </div>
                        </div>
                    )
                    :
                    <span />
            }
            <hr/>
            <div className="row m-b-medium">
                <div className="col-md-12">
                    <input type="button" className="btn btn-primary" value="Add Game" onClick={this.handleAddGame} />
                </div>
            </div>
        </div>);
    } 
};

Quiz.propTypes = {
    data: PropTypes.array.isRequired
};

class Book extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.props.onBookSelected(this.props.title);
    }
    render() {
        return <div className="answer" onClick={this.handleClick}>
            <h6>{this.props.title}</h6>
        </div>;
    }
};

Book.propTypes = {
    title: PropTypes.string.isRequired
};

class AddGameForm extends React.Component {
    constructor(props) {
        super(props);
        this.imageURL = React.createRef();
        this.answer1 = React.createRef();
        this.answer2 = React.createRef();
        this.answer3 = React.createRef();
        this.answer4 = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit() {
        var data = {
            imageURL: this.imageURL.current.value,
            answer1: this.answer1.current.value,
            answer2: this.answer2.current.value,
            answer3: this.answer3.current.value,
            answer4: this.answer4.current.value,
        };
        this.props.onGameFormSubmitted(data);
    }
    render() {
        return (<div>
            <div className="row m-b-medium">
                <div className="col-md-12">
                    <h1>Add Game</h1>
                    <form role="form" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input type="text" ref={this.imageURL} className="form-control" placeholder="Image URL" />
                        </div>
                        <div className="form-group">
                            <input type="text" ref={this.answer1} className="form-control" placeholder="Answer 1" />
                        </div>
                        <div className="form-group">
                            <input type="text" ref={this.answer2} className="form-control" placeholder="Answer 2" />
                        </div>
                        <div className="form-group">
                            <input type="text" ref={this.answer3} className="form-control" placeholder="Answer 3" />
                        </div>
                        <div className="form-group">
                            <input type="text" ref={this.answer4} className="form-control" placeholder="Answer 4" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>);
    }
};

AddGameForm.propTypes = {
    onGameFormSubmitted: PropTypes.func.isRequired
};

routie({
    '': function () {
        ReactDOM.render(<Quiz data={data} />, document.getElementById('app'));
    },
    'addGame': function () {
        ReactDOM.render(<AddGameForm onGameFormSubmitted={handleAddGameFormSubmitted} />, document.getElementById('app'));
    }
});

function handleAddGameFormSubmitted(data){
    var quizData = [{
        imageURL: data.imageURL,
        books: [data.answer1, data.answer2, data.answer3, data.answer4]
    }];
    quizData.selectGame = selectGame;
    ReactDOM.render(<Quiz data={quizData} />, document.getElementById('app'));
}