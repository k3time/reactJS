'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _underscore = require('underscore');

var _ = _interopRequireWildcard(_underscore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var data = [{
    "name": "Mark Twain",
    "imageURL": "app/dist/images/Mark_Twain.jpg",
    "books": ['The Adventures of Huckelberry Finn']
}, {
    "name": "Joseph Conrad",
    "imageURL": "app/dist/images/JJ_Thomson.jpg",
    "books": ['Heart of Darkness']
}, {
    "name": "J. K. Rowling",
    "imageURL": "app/dist/images/J_K_Rowling.jpg",
    "books": ['Harry Potter and the Sorcerers Stone']
}, {
    "name": "Stephen King",
    "imageURL": "app/dist/images/Stephen_King.jpg",
    "books": ['The Shining', 'IT']
}, {
    "name": "Charkles Dickens",
    "imageURL": "app/dist/images/Charles_Dickens.jpg",
    "books": ['David Copperfield', 'A Tale of Two Cities']
}, {
    "name": "William Shakespeare",
    "imageURL": "app/dist/images/William_Shakespeare.jpg",
    "books": ['Hamlet', 'Macbeth', 'Romeo and Juliet']
}];

data.selectGame = function () {
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
        checkAnswer: function checkAnswer(title) {
            return this.author.books.some(function (t) {
                return t === title;
            });
        }
    };
};

var Quiz = function (_React$Component) {
    _inherits(Quiz, _React$Component);

    function Quiz(props) {
        _classCallCheck(this, Quiz);

        var _this = _possibleConstructorReturn(this, (Quiz.__proto__ || Object.getPrototypeOf(Quiz)).call(this, props));

        _this.state = _.extend({
            bgClass: 'neutral',
            showContinue: false
        }, _this.props.data.selectGame());
        _this.handleBookSelected = _this.handleBookSelected.bind(_this);
        _this.handleContinue = _this.handleContinue.bind(_this);
        return _this;
    }

    _createClass(Quiz, [{
        key: 'handleBookSelected',
        value: function handleBookSelected(title) {
            var isCorrect = this.state.checkAnswer(title);
            this.setState({
                bgClass: isCorrect ? 'pass' : 'fail',
                showContinue: isCorrect
            });
        }
    }, {
        key: 'handleContinue',
        value: function handleContinue() {
            this.setState(_.extend({
                bgClass: 'neutral',
                showContinue: false
            }, this.props.data.selectGame()));
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col-md-3' },
                        _react2.default.createElement(
                            'figure',
                            { className: 'figure author' },
                            _react2.default.createElement('img', { src: this.state.author.imageURL, className: 'figure-img img-thumbnail img-fluid', alt: 'A generic square placeholder image with rounded corners in a figure.' }),
                            _react2.default.createElement(
                                'figcaption',
                                { className: 'figure-caption' },
                                this.state.author.name
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'col-md-7' },
                        this.state.books.map(function (b, i) {
                            return _react2.default.createElement(Book, { onBookSelected: _this2.handleBookSelected, title: b, key: i });
                        }, this)
                    ),
                    _react2.default.createElement('div', { className: "col-md-2 " + this.state.bgClass }),
                    _react2.default.createElement(
                        'div',
                        { className: 'col-md-12' },
                        _react2.default.createElement('br', null)
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'row continue' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col-md-12 text-right' },
                        this.state.showContinue ? _react2.default.createElement('input', { type: 'button', className: 'btn btn-success', value: 'Continue', onClick: this.handleContinue }) : _react2.default.createElement('span', null)
                    )
                )
            );
        }
    }]);

    return Quiz;
}(_react2.default.Component);

;

Quiz.propTypes = {
    data: _propTypes2.default.array.isRequired
};

var Book = function (_React$Component2) {
    _inherits(Book, _React$Component2);

    function Book(props) {
        _classCallCheck(this, Book);

        var _this3 = _possibleConstructorReturn(this, (Book.__proto__ || Object.getPrototypeOf(Book)).call(this, props));

        _this3.handleClick = _this3.handleClick.bind(_this3);
        return _this3;
    }

    _createClass(Book, [{
        key: 'handleClick',
        value: function handleClick() {
            this.props.onBookSelected(this.props.title);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'answer', onClick: this.handleClick },
                _react2.default.createElement(
                    'h6',
                    null,
                    this.props.title
                )
            );
        }
    }]);

    return Book;
}(_react2.default.Component);

;

Book.propTypes = {
    title: _propTypes2.default.string.isRequired
};

_reactDom2.default.render(_react2.default.createElement(Quiz, { data: data }), document.getElementById('app'));