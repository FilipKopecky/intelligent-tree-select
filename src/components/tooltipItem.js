import React, {Component} from 'react';
import {Tooltip} from 'reactstrap';
import Highlighter from 'react-highlight-words'

class TooltipItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            tooltipOpen: false
        };
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen,
        });
    }

    _getProvidersName(providers){
        let names = [];
        providers.forEach(provider => names.push(provider.name));
        return names.join(", ")
    }

    render() {
        return (
            <div id={'Tooltip-' + this.props.id} onClick={this.props.onClick} className={"result-item"}>

                <Highlighter
                    highlightClassName='highlighted'
                    searchWords={[this.props.searchString]}
                    autoEscape={false}
                    textToHighlight={this.props.label}
                    highlightTag={"span"}
                />

                <Tooltip innerClassName={"VirtualizedTreeSelectTooltip"}
                         style={{left: "400px!important"}}
                         placement={'right'} isOpen={this.props.hoverActive && this.state.tooltipOpen}
                         target={'Tooltip-' + this.props.id} autohide={false}
                         toggle={() => this.toggle()} delay={{"show": 300, "hide": 0}}
                         modifiers={{
                             preventOverflow: {
                                 escapeWithReference: true,
                             },
                         }}
                >
                    <b>Label: </b> {this.props.label} <br/>
                    <b>Value: </b>{this.props.value} <br/>
                    <b>Providers: </b>{this._getProvidersName(this.props.option.providers )}<br/>
                </Tooltip>
            </div>
        );
    }
}


export default TooltipItem;
