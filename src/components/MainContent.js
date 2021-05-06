import { Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import productService from "../services/productService";
import Spinner from "./Spinner";
import "./styles/productCard.css";
import "./styles/Products.css";

const useStyles = makeStyles({
  root: {
    transition: "transform 0.4s ease-in-out",
  },
  cardHovered: {
    transform: "scale3d(1.05, 1.05, 1)",
  },
});

export const ProductCard = ({ product }) => {
  const classes = useStyles();

  const [state, setState] = useState({
    raised: false,
    shadow: 1,
  });
  return (
    <Card
      className={classes.root}
      classes={{ root: state.raised ? classes.cardHovered : "" }}
      onMouseOver={() => setState({ raised: true, shadow: 3 })}
      onMouseOut={() => setState({ raised: false, shadow: 1 })}
      raised={state.raised}
      zdepth={state.shadow}
      style={{ width: 255, margin: 20, height: 338 }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          src={product.imagePath}
          image={product.imagePath}
          title={product.productName}
        />
      </CardActionArea>
      <CardContent>
        <Typography
          style={{ textAlign: "center", marginBottom: 10 }}
          gutterBottom
          variant="h5"
          component="h2"
        >
          {product.productName}
        </Typography>
        <Grid container direction="column" justify="center" alignItems="center">
          {product.previousPrice > 0 ? (
            <>
              <Typography variant="h6" style={{ textDecoration: "line-through" }}>
                {product.previousPrice}$
              </Typography>
              <Typography variant="h6">{product.unitPrice}$</Typography>
            </>
          ) : (
            <Typography variant="h6">{product.unitPrice}$</Typography>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

const MainContent = ({ data, setData, searchResults, setSearchResults }) => {
  const [loading, setLoading] = useState(true);
  let { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        let response;
        if (!id || id === "all") {
          response = await productService.getAllProduct();
        } else {
          response = await productService.getProductsByCategory(id);
        }
        if (response.status) {
          setData(response.products);
          setLoading(false);
          setSearchResults(response.products);
        } else {
          setLoading(false);
        }
      } catch (exception) {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  } else if (!loading && !data) {
    return (
      <div>
        <h2>There is a problem! Products are not loaded.</h2>
      </div>
    );
  } else {
    return (
      <div className="product_container">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>

        <Grid container direction="row" justify="center" alignItems="center">
          {searchResults?.map((product) => (
            <Link
              to={"/product/" + product._id}
              style={{ textDecoration: "none" }}
              key={product._id}
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </Grid>
      </div>
    );
  }
};

export default MainContent;
