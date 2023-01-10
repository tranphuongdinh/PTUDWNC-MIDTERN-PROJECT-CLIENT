import { Button, Link } from "@mui/material";
import InputIcon from '@mui/icons-material/Input';

export const CustomNotifyComponent = ({ closeToast, toastProps, content }) => {

    const buttonSX = {
        "&:hover": {
            color: 'white',
        },
        backgroundColor: '#ffebee',
        color: 'black',
        width: 100,
        height: 50,
        fontWeight: 'bold'
    };

    const iconSX = {
        width: 50,
        height: 50,
        color: 'white',
        "&:hover": {
            color: 'gray'
        }
    };

    return (
        <div>
            {content}
            <br /><br />
            <div style={{ display: 'flex', gap: 70, justifyContent: 'center' }}>
                <Button variant="contained" sx={buttonSX} onClick={closeToast}>Close</Button>
                <Link href="http://www.google.com" target="_blank" >
                    <InputIcon sx={iconSX} />
                </Link>
            </div>
        </div>
    )
}