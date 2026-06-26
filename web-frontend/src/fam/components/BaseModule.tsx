import React, { PropsWithChildren } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type BaseModuleProps = {

}

export const BaseModule = (props: PropsWithChildren<BaseModuleProps>) => {
    return (
        <div style={{ 
            background: 'linear-gradient(0deg,rgba(47, 79, 89, 1) 0%, rgba(115, 137, 148, 1) 100%)', 
            flex: '1 1 0', 
            padding: '16px', 
            borderStyle: 'outset',
            borderWidth: 'thick',
            borderColor: 'rgba(115, 137, 148, 1)',
            display: 'flex'
        }}>
            {props.children}
        </div>
    );
}