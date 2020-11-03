
import React, { Component, Fragment } from 'react'
import { render } from 'react-dom';
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import ToolTip from '@material-ui/core/Tooltip'
import EditIcon from '@material-ui/icon'
import { connect } from 'react-redux'

class EditDetails extends Component {
    state = {
        bio: '',
        school: '',
        grade: '',
    }
    render() {
        return (
            <Fragment>
                <ToolTip title="Edit details" placement="top">
                    <Button onPress={this.handleOpen} classname={classes.button}>
                        <EditIcon color='primary' />
                    </Button>
                </ToolTip>
                <Dialog open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth='sm'>
                    <DialogTitle>
                        Edit your details
                    </DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name='bio'
                                type="text"
                                label="Bio"
                                multiline
                                rows="3"
                                placeholder="A short bio about yourself"
                                className={classes.textField}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name='school'
                                type="text"
                                label="School"
                                placeholder="School"
                                className={classes.textField}
                                value={this.state.school}
                                onChange={this.handleChange}
                                fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onPress={this.handleClose} color="red">
                            Cancel
                        </Button>
                        <Button onPress={this.handleSubmit} color="greem">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>

        )
    }
}
EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}
const mapStatetoProps = (state) => ({
    credentials: state.user.credentials
})

export default EditDetails