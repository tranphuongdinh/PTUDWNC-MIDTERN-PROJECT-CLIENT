import { Button, Card, Container, FormLabel, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Chart } from "react-google-charts";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ShareIcon from "@mui/icons-material/Share";
import { getPresentationDetail, updatePresentation } from "../../../client/presentation";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { useContext } from "react";
import { SocketContext } from "../../../context/socketContext";
import Breadcrumb from "../../../components/Breadcrumb";
import PresentationDetail from "../../../features/Presentation/Detail";
const PresentationDetailPage = () => {
  const router = useRouter();

  const { id } = router.query;

  return <PresentationDetail id={id} />;
};

export default PresentationDetailPage;
