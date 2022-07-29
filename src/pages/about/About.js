import { Card, CardContent, Typography } from "@mui/material";

const About = () => <>
  <Card sx={{ minWidth: 275 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom component="div">
        Test Task - Senior Web Frontend Developer
      </Typography>
      <Typography variant="body1" gutterBottom>
        Using ReactJS, and <a href="https://ghibliapi.herokuapp.com/films">https://ghibliapi.herokuapp.com/films</a> public
        API, build a website that displays all Ghibli studios movies and allows 
        filters by release date (use range filter), director and producer. It should allow 
        to create and modify movies (Assume backend exists with all functionality, no need to
        actually create anything), as long as the following is given:
          <ul>
            <li>Title</li>
            <li>Description</li>
            <li>Director</li>
            <li>Producer</li>
            <li>Release Date</li>
          </ul>
        Please do not work on the database or backend, assume all exist and are
        ready to use. We want to see frontend design, data displaying and overall
        look and feel of the site. Please keep simplicity in mind, the exercise shouldn’t
        take more than 5 days to complete. Please feel free to have full control in the
        design, documentation and code structure, but know you will be evaluated in
        all three.
      </Typography>
    </CardContent>
  </Card>
</>

export default About;
