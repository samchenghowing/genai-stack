import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface PreviewProps {
    editorDoc: { jsDoc: string; htmlDoc: string; cssDoc: string };
}

export default function Preview(props: PreviewProps) {
    const [open, setOpen] = React.useState(false);
    const [consoleOutput, setConsoleOutput] = React.useState<string[]>([]);

    const handleClickOpen = () => {
        setOpen(true);
        setConsoleOutput([]); // Clear console output when opening
    };

    const handleClose = () => {
        setOpen(false);
    };

    const html = `
        <html>
            <head>
                <style>${props.editorDoc.cssDoc}</style>
            </head>
            <body>
                <h1>${props.editorDoc.htmlDoc}</h1>
                <script>
                    (function() {
                        const originalConsoleLog = console.log;
                        console.log = function(...args) {
                            window.parent.postMessage({ type: 'console-log', args: args }, '*');
                            originalConsoleLog.apply(console, args);
                        };
                    })();
                    ${props.editorDoc.jsDoc}
                </script>
            </body>
        </html>
    `;

    React.useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'console-log') {
                setConsoleOutput(prev => [...prev, ...event.data.args.map(arg => arg.toString())]);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Run the code
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Preview
                        </Typography>
                    </Toolbar>
                </AppBar>
                <iframe
                    srcDoc={html}
                    title="Preview"
                    width="100%"
                    height="80%"
                    style={{ border: 'none' }}
                ></iframe>
                <div style={{ height: '20%', overflowY: 'auto', padding: '8px', background: '#f5f5f5' }}>
                    <strong>Console Output:</strong>
                    <pre>{consoleOutput.join('\n')}</pre>
                </div>
            </Dialog>
        </React.Fragment>
    );
}
