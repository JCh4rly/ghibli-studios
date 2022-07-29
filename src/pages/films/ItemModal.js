import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Box } from "@mui/system";

const ItemModal = ({ item, open, handleClose, handleSave }) => {
  return <>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{ item.id ? "Edit item" : "New item" }</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
          <TextField
            required
            id="title"
            label="Title"
            defaultValue={item.title}
          />
          <TextField
            required
            id="director"
            label="Director"
            defaultValue={item.director}
          />
          <TextField
            required
            id="producer"
            label="Producer"
            defaultValue={item.producer}
          />
          <TextField
            required
            id="release_date"
            label="Release Date"
            defaultValue={item.release_date}
            type="number"
          />
          <TextField
            required
            id="description"
            label="Description"
            defaultValue={item.description}
            multiline
            maxRows={4}
          />
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => handleSave(item)}>Save</Button>
      </DialogActions>
    </Dialog>
  </>
}

export default ItemModal;