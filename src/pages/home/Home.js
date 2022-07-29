import { Card, CardContent, Typography } from "@mui/material";

const Home = () => <>
  <Card sx={{ minWidth: 275 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom component="div">
        Ghibli Studios API
      </Typography>
      <Typography variant="body1" gutterBottom>
        The Studio Ghibli API catalogs the people, places, and things 
        found in the worlds of Ghibli. It was created to help users discover 
        resources, consume them via HTTP requests, and interact with them in 
        whatever way makes sense. Navigation can be found on the left sidebar, 
        and the right sidebar shows examples of returned objects for successful calls.
        <br/>
        Users can raise an issue, ask for help, or find a contribution guide at 
        the main repo: <a href="https://github.com/janaipakos/ghibliapi">https://github.com/janaipakos/ghibliapi</a>
      </Typography>
    </CardContent>
  </Card>
</>

export default Home;
