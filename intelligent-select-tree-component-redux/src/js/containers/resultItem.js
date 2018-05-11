import React, {Component} from 'react';
import {Badge} from "reactstrap";
import TooltipItem from "./tooltipItem";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";


class ResultItem extends Component {

    _getWarningIcon() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                <g className="nc-icon-wrapper" fill="#f67d12">
                    <path
                        d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                </g>
            </svg>
        )
    }

    _getTogglePlusIcon() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <g className="nc-icon-wrapper" fill="#444444">
                    <path
                        d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </g>
            </svg>
        )
    }

    _getToggleMinusIcon() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <g className="nc-icon-wrapper" fill="#444444">
                    <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/>
                </g>
            </svg>
        )
    }

    _handleButtonClick() {
        this.props.option.expanded = !this.props.option.expanded;
        this.props.onToggleClick();
    }

    getCollapseButton() {

        let button = null;

        if (this.props.option.expanded) {
            button = this._getToggleMinusIcon()
        } else {
            button = this._getTogglePlusIcon()
        }
        return (
            <span onClick={() => this._handleButtonClick()} className={"toggleButton"}>
                {button}
            </span>
        )
    }


    render() {
        let button = null;
        let option = this.props.option;
        if (option[option.providers[0].childrenKey].length > 0) {
            button = this.getCollapseButton();
        }
        let style = {};
        style.width = option.depth*16+'px';

        let label = option[option.providers[0].labelKey];
        if (!(typeof label === 'string' || label instanceof String)){
            label = option.providers[0].labelValue(label)
        }

        return (
            <div style={this.props.style} className={this.props.className} onMouseEnter={this.props.onMouseEnter}>

                {this.props.settings.renderAsTree &&
                    <div style={style}>
                    </div>
                }

                {this.props.settings.renderAsTree &&
                    <div style={{width: '16px'}}>
                        {button}
                    </div>
                }

                <TooltipItem id={option.graph}
                             option={option}
                             label={label}
                             value={option[option.providers[0].valueKey]}
                             currentSearch={this.props.currentSearch}
                             onClick={this.props.onClick}
                             hoverActive={this.props.settings.displayInfoOnHover}
                />


                {option.state.label && this.props.settings.displayState &&
                <div className={"p-0 pl-1 pr-1"} xs="auto"><Badge
                    color={option.state.color}>{option.state.label}</Badge></div>
                }

            </div>
        )
    }
}


ResultItem.defaultProps = {
    tooltipPlacement: 'bottom',
    tooltipLabel: 'tooltip',
    tooltipDelay: {"show": 50, "hide": 50},
    termCategory: [],
    badgeLabel: '',
    badgeColor: 'primary',
};

function mapStateToProps(state) {
    return {
        options: state.options,
        currentSearch: state.other.currentSearch,
        settings: state.settings,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultItem);