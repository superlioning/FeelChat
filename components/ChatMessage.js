import React, { Component } from 'react';


/**
 * @returns - A single chat message
 */


class ChatMessage extends Component {
    render() {
        // Destructure props to get position and message; default position is 'left'
        const { position = 'left', message } = this.props;

        // Determine if the message is positioned on the right
        const isRight = position.toLowerCase() === 'right';

        // Set text alignment and justification based on the message position
        const align = isRight ? 'text-right' : 'text-left';
        const justify = isRight ? 'justify-content-end' : 'justify-content-start';

        // Define styles for the message box and message text
        const messageBoxStyles = {
            maxWidth: '70%',
            flexGrow: 0
        };

        const messageStyles = {
            fontWeight: 500,
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap'
        };

        return <div className={`w-100 my-1 d-flex ${justify}`}>
            <div className="bg-light rounded border border-gray p-2" style={messageBoxStyles}>
                <span className={`d-block text-secondary ${align}`} style={messageStyles}>
                    {message}
                </span>
            </div>
        </div>
    }
}

export default ChatMessage;