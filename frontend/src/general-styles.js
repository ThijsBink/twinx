import styled from 'styled-components'; 

export const Button = styled.button`
    background: ${props => props.primary ? "#0049CB" : "white"};
    color: ${props => props.primary ? "white" : "#0049CB"};
    font-size: 1em;
    padding: 0.25em 1em;
    border: 2px solid #0049CB;
    border-radius: 3px;
    text-align: center;
`;

export const GraphButton = styled(Button)`
    padding: 0.20em 0.8em;
    border-radius: 0px 0px 7px 7px;
    background-color: transparent;
`;





