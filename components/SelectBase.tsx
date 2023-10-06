import ReactSelect from 'react-select';

const SelectBase = (props: any) => {
  return (
    <ReactSelect
      styles={{
        container: (base) => ({
          ...base,
          flexGrow: 1,
        }),
        input: (base) => ({
          ...base,
          'input:focus': { boxShadow: 'none' },
        }),
        menu: (base) => ({
          ...base,
          fontSize: '0.875rem',
          zIndex: 3,
        }),
        singleValue: (base) => ({
          ...base,
          color: '#555',
          fontWeight: 'normal',
        }),
        control: (base, state) => ({
          ...base,
          borderColor: state.isFocused ? 'rgb(165, 180, 252)' : base.borderColor,
          borderRadius: '0.5rem',
          fontSize: '1rem',
          outline: 'none',
          boxShadow: 'none',
          minHeight: '40px',
        }),
        dropdownIndicator: (base) => ({
          ...base,
          padding: '4px 8px',
        }),
        clearIndicator: (base) => ({
          ...base,
          padding: '4px 8px',
        }),
        multiValueLabel: (base) => ({
          ...base,
          maxWidth: '175px',
        }),
      }}
      {...props}
    />
  );
};

export default SelectBase;
