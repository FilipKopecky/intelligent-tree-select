# Intelligent-tree-select

React tree select component based on [react-select](https://github.com/jedwatson/react-select)
and virtualization with [react-window](https://github.com/bvaughn/react-window).

#### Before start

Before you can use this component you will need [Node.js](https://nodejs.org/en/) in version 6.5+, but we recommend
using the latest available version.

### Getting started

Easiest way is to install via NPM

```
npm install intelligent-tree-select --save
```

Then import it

```
import { IntelligentTreeSelect } from "intelligent-tree-select"
import "intelligent-tree-select/lib/styles.css"
```

Usage example can be found in `examples/demo.js`

### Virtualized tree select Props

Props types are same as the one introduced by [react-select](https://github.com/JedWatson/react-select)
Additional parameters introduced by _intelligent-tree-select_ are:

| Property         | Type                   | Default Value | Description                                                                                                          |
| :--------------- | :--------------------- | :------------ | :------------------------------------------------------------------------------------------------------------------- |
| childrenKey      | `string`               | 'children'    | path of the child value in option objects                                                                            |
| expanded         | `bool`                 | false         | whether the options are expanded by default                                                                          |
| isMenuOpen       | `bool`                 | false         | Whether the menu is open. Setting this to true force menu to me always opened                                        |
| maxHeight        | `number`               | 300           | Maximum height of the dropdown menu                                                                                  |
| minHeight        | `number`               | 0             | Minimum height of the dropdown menu                                                                                  |
| menuRenderer     | `func`                 | -             | overriding built-in drop-down menu render component                                                                  |
| optionRenderer   | `React component/func` | -             | overriding built-in option render component                                                                          |
| valueRenderer    | `React component/func` | -             | overriding built-in value render component. Receives the selected option's label and the option itself as parameter. |
| optionHeight     | `number` or `func`     | 25px          | Option height. Dynamic height can be supported via a function with the signature `({ option: Object }): number`      |
| optionLeftOffset | `number`               | 16px          | Option base left offset. Left offset is calculated as `depth level of the option * optionLeftOffset`                 |
| renderAsTree     | `bool`                 | true          | whether options should be rendered as a tree.                                                                        |

#### Custom Option render

You can override the built-in option renderer by specifying your own `optionRenderer` property. Your renderer should
return a React element that represents the specified option. It will be passed the following named parameters:

| Property    | Type            | Description                                                   |
| :---------- | :-------------- | :------------------------------------------------------------ |
| data        | `Array<Object>` | Options to render in the menu list.                           |
| key         | `string`        | A unique identifier for each element created by the renderer. |
| optionStyle | `Object`        | Passed styles for option.                                     |
| selectProps | `SelectProps`   | Props of Select.                                              |
| isFocused   | `bool`          | Whether the option is focused.                                |
| isDisabled  | `bool`          | Whether the option is focused.                                |
| isSelected  | `bool`          | Whether the option is selected.                               |

#### SelectProps

If you override the `optionRenderer` the `react-select` props are passed in the `selectProps` property. It gives you
access to the internals of the select. Some useful properties are listed below.

| Property       | Type       | Description                                                                                       |
| :------------- | :--------- | :------------------------------------------------------------------------------------------------ |
| childrenKey    | `string`   | Attribute of option that contains the children key.                                               |
| key            | `string`   | A unique identifier for each element created by the renderer.                                     |
| labelKey       | `string`   | Attribute of option that contains the display text.                                               |
| getOptionLabel | `Function` | Function to extract label from an option. If specified, overrides `labelKey`.                     |
| renderAsTree   | `bool`     | Whether the options should be render as a tree.                                                   |
| searchString   | `string`   | Current content of the search input.                                                              |
| onOptionSelect | `Function` | Callback to update the selected values; for example, you may want to call this function on click. |
| onOptionToggle | `Function` | Expand/Collapse option if it has children.                                                        |
| valueKey       | `string`   | Attribute of option that contains the value.                                                      |

### Intelligent tree select props

| Property           | Type            | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                                      |
| :----------------- | :-------------- | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| displayInfoOnHover | `bool`          | false         | Whether to render option information on hover. By default, this info is extracted by transforming the option to JSON and stringifying it.                                                                                                                                                                                                                                                        |
| tooltipKey         | `string`        | --            | Attribute of option which will be used as content of hover tooltip (instead of stringified option itself).                                                                                                                                                                                                                                                                                       |
| labelKey           | `string`        | `label`       | Attribute of option that contains the display text.                                                                                                                                                                                                                                                                                                                                              |
| getOptionLabel     | `Function`      | --            | Function to extract label from an option. If specified, overrides `labelKey`.                                                                                                                                                                                                                                                                                                                    |
| onOptionCreate     | `function`      | --            | callback when the new option is created. Signature `({ option: Object}): none`                                                                                                                                                                                                                                                                                                                   |
| optionLifetime     | `string`        | '5m'          | String representing how long the options should be cached. Syntax: `XdXhXmXs` where `X` is some number, `d` stands for days, `h` hours ,`m` minutes, `s` seconds                                                                                                                                                                                                                                 |
| simpleTreeData     | `bool`          | true          | whether the options are in the simple format. (One node == one option)                                                                                                                                                                                                                                                                                                                           |
| fetchOptions       | `func`          | --            | Signature: `({searchString, optionID, limit, offset, option}): Promise`. If the `optionID` is not an empty string then the function should return children options of that option (`option` is provided as well should it be needed). If the `searchString` is not an empty string then the function should return all options whose label value match the `searchStromg` + their parent options |
| options            | `Array<Object>` | --            | Options to render in the menu list. If `fetchOptions` is not specified (it takes precedence over this property if specified), this property can be used to provide options to select from. Note that it is recommended to _ memoize_ them.                                                                                                                                                       |
| fetchLimit         | `number`        | 100           | amount of data to be fetched                                                                                                                                                                                                                                                                                                                                                                     |
| multi              | `bool`          | true          | whether the select in multi select or not                                                                                                                                                                                                                                                                                                                                                        |
| name               | `string`        | --            | Unique name for the component. Whenever this prop is set then the options will be cached                                                                                                                                                                                                                                                                                                         |
| formComponent      | `func`          | --            | Function returning React element representing form. Syntax `({onOptionCreate, toggleModal, options, labelKey, valueKey, childrenKey}): React.component`                                                                                                                                                                                                                                          |
| searchDelay        | `number`        | --            | Delay in milliseconds between the input change and `fetchOptions` invocation. Allows to wait for reasonable user input before actually invoking search on the server. By default the search is invoked with no delay.                                                                                                                                                                            |
| isClearable        | `boolean`       | true          | Sets whether the values can be cleared                                                                                                                                                                                                                                                                                                                                                           |
| valueIsControlled  | `boolean`       | true          | Sets if the passed value is changed over time. If not, the value can be used only to set the initial values                                                                                                                                                                                                                                                                                      |
| menuIsFloating     | `boolean`       | true          | Sets if the dropdown is rendered above content or as a part of it                                                                                                                                                                                                                                                                                                                                |

### IntelligentTreeSelect public API

| Method         | Description                                                                                                                                                                  |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `resetOptions` | Force reloading of options when `fetchOptions` property is used to specify how to load options. If options are specified in props, this reloads them from the current props. |
| `getOptions`   | Gets the options (flattened) currently provided by the component.                                                                                                            |
| `focus`        | Focus the tree select input.                                                                                                                                                 |
| `blurInput`    | Blur the tree select input.                                                                                                                                                  |
