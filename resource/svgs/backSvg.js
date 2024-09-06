import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function BackSvg(props) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={28}
            height={28}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#010F07"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-chevron-left"
        >
            <Path d="M15 18L9 12 15 6" />
        </Svg>
    );
}

export default BackSvg;
