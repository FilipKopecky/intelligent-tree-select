'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactstrap = require('reactstrap');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _settingsActions = require('../actions/settings-actions');

var settingsAction = _interopRequireWildcard(_settingsActions);

var _modalWindow = require('../containers/modalWindow');

var _modalWindow2 = _interopRequireDefault(_modalWindow);

var _optionsActions = require('../actions/options-actions');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Settings = function (_Component) {
    (0, _inherits3.default)(Settings, _Component);

    function Settings() {
        (0, _classCallCheck3.default)(this, Settings);
        return (0, _possibleConstructorReturn3.default)(this, (Settings.__proto__ || (0, _getPrototypeOf2.default)(Settings)).apply(this, arguments));
    }

    (0, _createClass3.default)(Settings, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'd-flex flex-column' },
                _react2.default.createElement(
                    'div',
                    { className: 'd-flex justify-content-between' },
                    _react2.default.createElement(_modalWindow2.default, { onOptionCreate: this.props.onOptionCreate }),
                    _react2.default.createElement(
                        _reactstrap.Button,
                        { color: 'link', onClick: function onClick() {
                                return _this2.props.toggleSettings();
                            } },
                        this.props.settings.settingsOpened ? "Hide filter" : "Show filter"
                    )
                ),
                _react2.default.createElement(
                    _reactstrap.Collapse,
                    { className: 'w-100', isOpen: this.props.settings.settingsOpened },
                    _react2.default.createElement(
                        _reactstrap.Card,
                        null,
                        _react2.default.createElement(
                            _reactstrap.CardBody,
                            null,
                            _react2.default.createElement(
                                _reactstrap.Form,
                                null,
                                _react2.default.createElement(
                                    _reactstrap.FormGroup,
                                    { check: true },
                                    _react2.default.createElement(
                                        _reactstrap.Label,
                                        { check: true },
                                        _react2.default.createElement(_reactstrap.Input, { type: 'checkbox', name: 'multiselect', onClick: function onClick() {
                                                return _this2.props.toggleMultiselect();
                                            }, defaultChecked: this.props.settings.multi }),
                                        ' ',
                                        'Multiselect'
                                    )
                                ),
                                _react2.default.createElement(
                                    _reactstrap.FormGroup,
                                    { check: true },
                                    _react2.default.createElement(
                                        _reactstrap.Label,
                                        { check: true },
                                        _react2.default.createElement(_reactstrap.Input, { type: 'checkbox', name: 'displayTermState', onClick: function onClick() {
                                                return _this2.props.toggleOptionStateDisplay();
                                            }, defaultChecked: this.props.settings.displayState }),
                                        ' ',
                                        'Display Term State'
                                    )
                                ),
                                _react2.default.createElement(
                                    _reactstrap.FormGroup,
                                    { check: true },
                                    _react2.default.createElement(
                                        _reactstrap.Label,
                                        { check: true },
                                        _react2.default.createElement(_reactstrap.Input, { type: 'checkbox', name: 'infoOnHover', onClick: function onClick() {
                                                return _this2.props.toggleDisplayOptionInfoOnHover();
                                            }, defaultChecked: this.props.settings.displayInfoOnHover }),
                                        ' ',
                                        'Show info on hover'
                                    )
                                ),
                                _react2.default.createElement(
                                    _reactstrap.FormGroup,
                                    { check: true },
                                    _react2.default.createElement(
                                        _reactstrap.Label,
                                        { check: true },
                                        _react2.default.createElement(_reactstrap.Input, { type: 'checkbox', name: 'infoOnHover', onClick: function onClick() {
                                                return _this2.props.toggleRenderAsTree();
                                            }, defaultChecked: this.props.settings.renderAsTree }),
                                        ' ',
                                        'Render as tree'
                                    )
                                ),
                                this.props.settings.renderAsTree && _react2.default.createElement(
                                    _reactstrap.FormGroup,
                                    { check: true },
                                    _react2.default.createElement(
                                        _reactstrap.Label,
                                        { check: true },
                                        _react2.default.createElement(_reactstrap.Input, { type: 'checkbox', name: 'expanded', onClick: function onClick() {
                                                _this2.props.toggleExpanded();
                                                _this2.props.setExpandedForAll(!_this2.props.settings.expanded);
                                            }, defaultChecked: this.props.settings.expanded }),
                                        ' ',
                                        'Expanded'
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);
    return Settings;
}(_react.Component);

function mapStateToProps(state) {
    return {
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return (0, _redux.bindActionCreators)({
        toggleSettings: settingsAction.toggleSettings,
        toggleExpanded: settingsAction.toggleExpanded,
        toggleOptionStateDisplay: settingsAction.toggleOptionStateDisplay,
        toggleDisplayOptionInfoOnHover: settingsAction.toggleDisplayOptionInfoOnHover,
        toggleRenderAsTree: settingsAction.toggleRenderAsTree,
        toggleMultiselect: settingsAction.toggleMultiselect,
        setExpandedForAll: _optionsActions.setExpandedForAll
    }, dispatch);
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Settings);