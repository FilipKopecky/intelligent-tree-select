import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {toggleExpanded} from "../actions/options-actions";

import ResultItem from './resultItem'
import {setCurrentSearchInput} from "../actions/other-actions";
import createFilterOptions from "./filters/TreeNodeFastFilter"
import {AutoSizer, List} from "react-virtualized";

import PropTypes from 'prop-types'
import Select from 'react-select'



class VirtualizedTreeSelect extends Component {

    static propTypes = {
        async: PropTypes.bool,
        listProps: PropTypes.object,
        maxHeight: PropTypes.number,
        optionHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
        optionRenderer: PropTypes.func,
        selectComponent: PropTypes.func
    };

    static defaultProps = {
        async: false,
        maxHeight: 300,
        optionHeight: 25
    };

    constructor (props, context) {
        super(props, context)

        this._renderMenu = this._renderMenu.bind(this)
        this._optionRenderer = this._optionRenderer.bind(this)
        this._setListRef = this._setListRef.bind(this)
        this._setSelectRef = this._setSelectRef.bind(this)
    }

    /** See List#recomputeRowHeights */
    recomputeOptionHeights (index = 0) {
        if (this._listRef) {
            this._listRef.recomputeRowHeights(index)
        }
    }

    /** See Select#focus (in react-select) */
    focus () {
        if (this._selectRef) {
            return this._selectRef.focus()
        }
    }

    // See https://github.com/JedWatson/react-select/#effeciently-rendering-large-lists-with-windowing
    _renderMenu ({ focusedOption, focusOption, labelKey, onSelect, options, selectValue, valueArray }) {
        const { listProps, optionRenderer } = this.props;
        const focusedOptionIndex = options.indexOf(focusedOption);
        const height = this._calculateListHeight({ options });
        const innerRowRenderer = optionRenderer || this._optionRenderer;
        const onTooggleClick = this.forceUpdate.bind(this);

        // react-select 1.0.0-rc2 passes duplicate `onSelect` and `selectValue` props to `menuRenderer`
        // The `Creatable` HOC only overrides `onSelect` which breaks an edge-case
        // In order to support creating items via clicking on the placeholder option,
        // We need to ensure that the specified `onSelect` handle is the one we use.
        // See issue #33

        function wrappedRowRenderer ({ index, key, style }) {
            const option = options[index];


            return innerRowRenderer({
                focusedOption,
                focusedOptionIndex,
                focusOption,
                key,
                labelKey,
                onSelect,
                option,
                optionIndex: index,
                options,
                selectValue: onSelect,
                style,
                valueArray,
                onTooggleClick,
            })
        }

        return (
            <AutoSizer disableHeight>
                {({ width }) => (
                    <List
                        className='VirtualSelectGrid'
                        height={height}
                        ref={this._setListRef}
                        rowCount={options.length}
                        rowHeight={({ index }) => this._getOptionHeight({
                            option: options[index]
                        })}
                        rowRenderer={wrappedRowRenderer}
                        scrollToIndex={focusedOptionIndex}
                        width={width}
                        {...listProps}
                    />
                )}
            </AutoSizer>
        )
    }

    _calculateListHeight ({ options }) {
        const { maxHeight } = this.props

        let height = 0

        for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
            let option = options[optionIndex]

            height += this._getOptionHeight({ option })

            if (height > maxHeight) {
                return maxHeight
            }
        }

        return height
    }

    _getOptionHeight ({ option }) {
        const { optionHeight } = this.props

        return optionHeight instanceof Function
            ? optionHeight({ option })
            : optionHeight
    }

    _getSelectComponent () {
        const { async, selectComponent } = this.props

        if (selectComponent) {
            return selectComponent
        } else if (async) {
            return Select.Async
        } else {
            return Select
        }
    }

    _setListRef (ref) {
        this._listRef = ref
    }

    _setSelectRef (ref) {
        this._selectRef = ref
    }

    _optionRenderer ({ focusedOption, focusOption, key, labelKey, option, selectValue, style, valueArray, onTooggleClick }) {

        const className = ['VirtualizedSelectOption'];

        if (option === focusedOption) {
            className.push('VirtualizedSelectFocusedOption')
        }

        if (option.disabled) {
            className.push('VirtualizedSelectDisabledOption')
        }

        if (valueArray && valueArray.indexOf(option) >= 0) {
            className.push('VirtualizedSelectSelectedOption')
        }

        if (option.className) {
            className.push(option.className)
        }

        const events = option.disabled
            ? {}
            : {
                onClick: () => selectValue(option),
                onMouseEnter: () => focusOption(option)
            };

        return (
            <ResultItem
                className={className.join(' ')}
                key={key}
                style={style}
                option={option}
                label={option[labelKey]}
                {...events}
                onTooggleClick={onTooggleClick}
            />
        )
    }

    render() {
        const SelectComponent = this._getSelectComponent();

        let attributes = {};
        if (this.props.renderAsTree) attributes.filterOptions = createFilterOptions({options: this.props.options, valueKey:this.props.valueKey, labelKey: this.props.labelKey})

        return (
            <SelectComponent
                closeOnSelect={false}
                removeSelected={false}

                joinValues={!!this.props.multi}
                menuStyle={{ overflow: 'hidden' }}
                ref={this._setSelectRef}
                menuRenderer={this._renderMenu}
                onInputChange={(x) => this.props.setCurrentSearchInput(x)}
                {...this.props}
                {...attributes}
            />
        )
    }
}


function mapStateToProps(state) {
    return {
        currentSearch: state.other.currentSearch,
        selectedOption: state.options.selectedOption,
        options: state.options.options
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleExpanded: toggleExpanded,
        setCurrentSearchInput: setCurrentSearchInput,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(VirtualizedTreeSelect);