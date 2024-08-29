import React, { useState, useEffect } from 'react';
import { Select } from '../../components/controls/Select';
import guid from '../../guid';
import NodeSharedPortDefinitions from '../../node-shared-port-definitions';
import { createNodeFromReactComponent } from '../../react-component-node';
import Utils from './utils';

const OptionsNode = {
  name: 'net.noodl.controls.options',
  displayName: 'Dropdown',
  docs: 'https://docs.noodl.net/nodes/ui-controls/dropdown',
  allowChildren: false,
  noodlNodeAsProp: true,
  usePortAsLabel: 'label',
  nodeDoubleClickAction: {
    focusPort: 'label'
  },
  connectionPanel: {
    groupPriority: [
      'General',
      'Style',
      'Actions',
      'Events',
      'States',
      'Mounted',
      'Text Style',
      'Label',
      'Label Text Style',
      'Hover Events',
      'Pointer Events',
      'Focus Events'
    ]
  },
  initialize: function () {
    const [items, setItems] = useState([]);
    const [value, setValue] = useState('');
    
    useEffect(() => {
      this.props.id = 'input-' + guid();
    }, []);

    this.props.valueChanged = (newValue) => {
      if (newValue !== undefined && typeof newValue !== 'string') {
        if (newValue?.toString !== undefined) newValue = newValue.toString();
        else return;
      }

      const changed = value !== newValue;
      setValue(newValue);

      if (changed) {
        this.flagOutputDirty('value');
        this.sendSignalOnOutput('onChange');
      }
    };

    this.props.clear = () => {
      setValue('');
      this.flagOutputDirty('value');
    };

    this.props.itemsChanged = (newItems) => {
      setItems(newItems);
    };
  },
  getReactComponent() {
    return () => {
      const [items, setItems] = useState(this.props.items || []);
      const [value, setValue] = useState(this.props.value || '');

      useEffect(() => {
        this.props.itemsChanged = setItems;
        this.props.valueChanged = setValue;
      }, []);

      return <Select items={items} value={value} onChange={setValue} />;
    };
  },
  inputs: {
    items: {
      type: 'array',
      displayName: 'Items',
      group: 'General',
      set: function (newItems) {
        this.props.itemsChanged(newItems);
      }
    },
    value: {
      type: 'string',
      displayName: 'Value',
      group: 'General',
      set: function (newValue) {
        this.props.valueChanged(newValue);
      }
    },
    clear: {
      type: 'signal',
      displayName: 'Clear',
      group: 'Actions',
      set: function () {
        this.props.clear();
      }
    }
  },
  inputProps: {
    placeholder: {
      displayName: 'Placeholder',
      type: 'string',
      group: 'Placeholder'
    },
    placeholderOpacity: {
      group: 'Placeholder',
      displayName: 'Placeholder opacity',
      type: 'number',
      default: 0.5
    }
  },
  outputs: {
    value: {
      type: 'string',
      displayName: 'Value',
      group: 'States',
      getter: function () {
        return this.props.value;
      }
    },
    onChange: {
      type: 'signal',
      displayName: 'Changed',
      group: 'Events'
    }
  },
  inputCss: {
    backgroundColor: {
      index: 100,
      displayName: 'Background Color',
      group: 'Style',
      type: 'color',
      default: 'transparent',
      styleTag: 'inputWrapper',
      allowVisualStates: true
    }
  }
};

NodeSharedPortDefinitions.addDimensions(OptionsNode, {
  defaultSizeMode: 'contentSize',
  contentLabel: 'Content'
});
NodeSharedPortDefinitions.addAlignInputs(OptionsNode);
NodeSharedPortDefinitions.addTextStyleInputs(OptionsNode);
NodeSharedPortDefinitions.addTransformInputs(OptionsNode);
NodeSharedPortDefinitions.addPaddingInputs(OptionsNode, {
  styleTag: 'inputWrapper'
});
NodeSharedPortDefinitions.addMarginInputs(OptionsNode);
NodeSharedPortDefinitions.addIconInputs(OptionsNode, {
  enableIconPlacement: true,
  defaults: { useIcon: false, iconColor: '#000000' }
});
NodeSharedPortDefinitions.addLabelInputs(OptionsNode, {
  enableSpacing: true,
  styleTag: 'label'
});
NodeSharedPortDefinitions.addSharedVisualInputs(OptionsNode);
NodeSharedPortDefinitions.addBorderInputs(OptionsNode, {
  defaults: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 5
  },
  styleTag: 'inputWrapper'
});

NodeSharedPortDefinitions.addShadowInputs(OptionsNode, {
  styleTag: 'inputWrapper'
});
Utils.addControlEventsAndStates(OptionsNode);

export default createNodeFromReactComponent(OptionsNode);
