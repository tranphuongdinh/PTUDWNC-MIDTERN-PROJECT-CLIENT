import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { deletePresentation } from "../../../client/presentation";
import GroupsIcon from "@mui/icons-material/Groups";
import ShareIcon from "@mui/icons-material/Share";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { Button, Card, Container, Grid, TextField } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  getPresentationDetail,
  updatePresentation,
} from "../../../client/presentation";
import Breadcrumb from "../../../components/Breadcrumb";
import Heading from "../../../components/Presentation/Heading";
import MultipleChoice from "../../../components/Presentation/MultipleChoice";
import Paragraph from "../../../components/Presentation/Paragraph";
import { SocketContext } from "../../../context/socketContext";
import { customToast } from "../../../utils";
import styles from "./styles.module.scss";

const PresentationItem = (props) => {
  const { presentType, ...rest } = props;
  if (presentType === "Multiple Choice") {
    return <MultipleChoice {...rest} />;
  }
  if (presentType === "Heading") {
    return <Heading {...rest} />;
  }
  return <Paragraph {...rest} />;
};

const PresentationDetail = ({ id }) => {
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const [presentation, setPresentation] = useState({});
  const [slides, setSlides] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getPresentation = async () => {
    try {
      const res = await getPresentationDetail(id);
      const presentation = res?.data?.[0];
      setPresentation(presentation);
      setSlides(JSON.parse(presentation?.slides) || null);
    } catch (e) {}
  };

  const updatePresentationDetail = async (config = {}) => {
    try {
      const newPresentation = {
        ...presentation,
        slides: JSON.stringify(slides),
        ...config,
      };
      const res = await updatePresentation(newPresentation);
    } catch (e) {}
  };

  useEffect(() => {
    updatePresentationDetail();
  }, [slides]);

  useEffect(() => {
    getPresentation();
  }, []);

  const handleRemovePresentation = async (id) => {
    try {
      const res = await deletePresentation(id);
      if (res?.status === "OK") {
        await customToast("SUCCESS", "Delete presentation successfully!");
        await getUser();
        window.location.href = "/presentation";
      } else {
        await customToast("ERROR", res?.message);
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message);
    }
  };

  return (
    <>
      <Breadcrumb
        paths={[
          { label: "Home", href: "/" },
          { label: "Presentation", href: "/presentation" },
          { label: presentation?.name, href: `/presentation/${id}` },
        ]}
      />
      {slides ? (
        <Container className={styles.wrapper}>
          <Grid container spacing={3}>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <h1 style={{ marginLeft: 20 }}>{presentation?.name}</h1>
              </Grid>
              <Grid item xs={12} md={6} className={styles.buttonGroup}>
                <Button
                  sx={{ margin: "10px 0 10px 20px" }}
                  variant="contained"
                  onClick={() => {
                    router.push(`/presentation/${id}/collaboration`);
                  }}
                >
                  <GroupsIcon />
                  &nbsp;Collaborate
                </Button>
                <CopyToClipboard
                  text={`${window?.location?.href}/slideshow`}
                  onCopy={async () =>
                    await customToast("SUCCESS", "Presentation link copied!")
                  }
                >
                  <Button
                    sx={{ margin: "10px 0 10px 20px" }}
                    variant="contained"
                  >
                    <ShareIcon />
                    &nbsp;Share
                  </Button>
                </CopyToClipboard>
                <Button
                  sx={{ margin: "10px 0 10px 20px" }}
                  variant="contained"
                  onClick={async () => {
                    await updatePresentationDetail({ isPresent: true });
                    socket.emit("clientStartPresent", presentation?._id);
                    router.push(`/presentation/${id}/slideshow`);
                  }}
                >
                  <SlideshowIcon />
                  &nbsp;Present
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemovePresentation(presentation?._id);
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Grid>
            </Grid>

            <Grid container item xs={12}>
              <div>
                <Button
                  style={{ marginLeft: "20px" }}
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  variant="contained"
                >
                  <AddIcon />
                  &nbsp;New Slide
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      const newSlides = [
                        ...slides,
                        {
                          type: "Multiple Choice",
                          content: {
                            question: "Your question",
                            options: [
                              {
                                label: "Option 1",
                                data: 0,
                              },
                              {
                                label: "Option 2",
                                data: 0,
                              },
                            ],
                          },
                        },
                      ];
                      setSlides(newSlides);
                      handleClose();
                    }}
                  >
                    Multiple Choice
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      const newSlides = [
                        ...slides,
                        {
                          type: "Heading",
                          content: {
                            heading: "This is heading",
                            subHeading: "This is sub heading",
                          },
                        },
                      ];
                      setSlides(newSlides);
                      handleClose();
                    }}
                  >
                    Heading
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      const newSlides = [
                        ...slides,
                        {
                          type: "Paragraph",
                          content: {
                            heading: "This is heading",
                            paragraph: "This is paragraph",
                          },
                        },
                      ];
                      setSlides(newSlides);
                      handleClose();
                    }}
                  >
                    Paragraph
                  </MenuItem>
                </Menu>
              </div>
              {/* <Button
              style={{ marginLeft: "20px" }}
              onClick={() => {
                const newSlides = [
                  ...slides,
                  {
                    type: "Multiple Choice",
                    content: {
                      question: "Your question",
                      options: [
                        {
                          label: "Option 1",
                          data: 0,
                        },
                        {
                          label: "Option 2",
                          data: 0,
                        },
                      ],
                    },
                  },
                ];
                setSlides(newSlides);
              }}
              variant="contained"
            >
              <AddIcon />
              &nbsp;New Slide
            </Button> */}
            </Grid>

            <Grid container item xs={12} spacing={3}>
              <Grid item md={2} container spacing={2}>
                <div className={styles.slidesList}>
                  {slides.map((slide, index) => (
                    <Grid
                      item
                      xs={12}
                      key={index}
                      className={clsx(
                        styles.slideItem,
                        index === selectedSlide && styles.selected
                      )}
                    >
                      <span className={styles.index}>{index}</span>

                      <Card
                        onClick={() => setSelectedSlide(index)}
                        class={styles.previewSlideItem}
                      >
                        <PresentationItem
                          presentType={slides[index].type}
                          {...slides[index].content}
                          type="preview"
                        />
                      </Card>
                      <Button
                        className={styles.deleteButton}
                        onClick={() => {
                          if (index === selectedSlide) {
                            const idx = index > 0 ? index - 1 : 0;
                            setSelectedSlide(idx);
                          }
                          const tmp = [...slides];
                          tmp.splice(index, 1);
                          setSlides([...tmp]);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Grid>
                  ))}
                </div>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <div className={styles.previewSlide}>
                  {slides.length ? (
                    <PresentationItem
                      presentType={slides[selectedSlide].type}
                      {...slides[selectedSlide].content}
                    />
                  ) : (
                    <h2>Empty slide</h2>
                  )}
                </div>
              </Grid>
              {slides.length ? (
                <Grid item md={4} sm={12} container className={styles.content}>
                  <div>
                    <h3>Edit your slide</h3>

                    <div item xs={12}>
                      {slides[selectedSlide].type === "Multiple Choice" ? (
                        <TextField
                          label="Your question"
                          placeholder="Type your question"
                          fullWidth
                          style={{ marginTop: "30px" }}
                          value={slides[selectedSlide].content.question}
                          onChange={(e) => {
                            const replaceSlide = {
                              ...slides[selectedSlide],
                              content: {
                                ...slides[selectedSlide].content,
                                question: e.target.value,
                              },
                            };
                            const tmp = [...slides];
                            tmp.splice(selectedSlide, 1, replaceSlide);
                            setSlides([...tmp]);
                          }}
                        />
                      ) : (
                        <TextField
                          label="Heading"
                          placeholder="Heading"
                          fullWidth
                          style={{ marginTop: "30px" }}
                          value={slides[selectedSlide].content.heading}
                          onChange={(e) => {
                            const replaceSlide = {
                              ...slides[selectedSlide],
                              content: {
                                ...slides[selectedSlide].content,
                                heading: e.target.value,
                              },
                            };
                            const tmp = [...slides];
                            tmp.splice(selectedSlide, 1, replaceSlide);
                            setSlides([...tmp]);
                          }}
                        />
                      )}
                      {slides[selectedSlide].type === "Heading" && (
                        <TextField
                          label="Sub Heading"
                          placeholder="Sub Heading"
                          fullWidth
                          style={{ marginTop: "30px" }}
                          value={slides[selectedSlide].content.subHeading}
                          onChange={(e) => {
                            const replaceSlide = {
                              ...slides[selectedSlide],
                              content: {
                                ...slides[selectedSlide].content,
                                subHeading: e.target.value,
                              },
                            };
                            const tmp = [...slides];
                            tmp.splice(selectedSlide, 1, replaceSlide);
                            setSlides([...tmp]);
                          }}
                        />
                      )}
                      {slides[selectedSlide].type === "Paragraph" && (
                        <TextField
                          label="Paragraph"
                          placeholder="Paragraph"
                          fullWidth
                          style={{ marginTop: "30px" }}
                          value={slides[selectedSlide].content.paragraph}
                          onChange={(e) => {
                            const replaceSlide = {
                              ...slides[selectedSlide],
                              content: {
                                ...slides[selectedSlide].content,
                                paragraph: e.target.value,
                              },
                            };
                            const tmp = [...slides];
                            tmp.splice(selectedSlide, 1, replaceSlide);
                            setSlides([...tmp]);
                          }}
                        />
                      )}
                      {slides[selectedSlide].type === "Multiple Choice" &&
                        slides[selectedSlide].content.options.length > 0 &&
                        slides[selectedSlide].content.options.map(
                          (option, index) => (
                            <div key={index}>
                              <TextField
                                label="Option 1"
                                placeholder="Type option 1"
                                fullWidth
                                style={{ marginTop: "30px" }}
                                value={
                                  slides[selectedSlide].content.options[index]
                                    .label
                                }
                                onChange={(e) => {
                                  // full code to control option in slides state
                                  const newOptions = [
                                    ...slides[selectedSlide].content.options,
                                  ];
                                  newOptions.splice(index, 1, {
                                    ...newOptions[index],
                                    label: e.target.value,
                                  });
                                  const replaceSlide = {
                                    ...slides[selectedSlide],
                                    content: {
                                      ...slides[selectedSlide].content,
                                      options: [...newOptions],
                                    },
                                  };
                                  const tmp = [...slides];
                                  tmp.splice(selectedSlide, 1, replaceSlide);
                                  setSlides([...tmp]);
                                }}
                              />
                              <Button
                                size="small"
                                onClick={() => {
                                  const newOptions = [
                                    ...slides[selectedSlide].content.options,
                                  ];
                                  newOptions.splice(index, 1);
                                  const replaceSlide = {
                                    ...slides[selectedSlide],
                                    content: {
                                      ...slides[selectedSlide].content,
                                      options: [...newOptions],
                                    },
                                  };
                                  const tmp = [...slides];
                                  tmp.splice(selectedSlide, 1, replaceSlide);
                                  setSlides([...tmp]);
                                }}
                              >
                                <DeleteIcon style={{ fontSize: "18px" }} />
                                &nbsp;Delete option {index + 1}
                              </Button>
                            </div>
                          )
                        )}
                    </div>
                    {slides[selectedSlide].type === "Multiple Choice" && (
                      <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        style={{ marginTop: "30px" }}
                        onClick={() => {
                          const newOptions = [
                            ...slides[selectedSlide].content.options,
                          ];
                          newOptions.push({
                            label: `Option ${newOptions.length + 1}`,
                            data: 0,
                          });
                          const replaceSlide = {
                            ...slides[selectedSlide],
                            content: {
                              ...slides[selectedSlide].content,
                              options: [...newOptions],
                            },
                          };
                          const tmp = [...slides];
                          tmp.splice(selectedSlide, 1, replaceSlide);
                          setSlides([...tmp]);
                        }}
                      >
                        Add option
                      </Button>
                    )}
                  </div>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Container>
      ) : (
        <p style={{ textAlign: "center" }}>This pesentation cannot be found</p>
      )}
    </>
  );
};

export default PresentationDetail;
