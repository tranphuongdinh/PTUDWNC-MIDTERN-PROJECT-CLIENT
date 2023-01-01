import {
  Button,
  Card,
  Container,
  FormLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ShareIcon from "@mui/icons-material/Share";
import {
  getPresentationDetail,
  updatePresentation,
} from "../../../client/presentation";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { useContext } from "react";
import { SocketContext } from "../../../context/socketContext";
import Breadcrumb from "../../../components/Breadcrumb";
import MultipleChoice from "../../../components/Presentation/MultipleChoice";
import Heading from "../../../components/Presentation/Heading";
import Paragraph from "../../../components/Presentation/Paragraph";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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
      setSlides(JSON.parse(presentation?.slides) || []);
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

  return (
    <>
      <Breadcrumb
        paths={[
          { label: "Home", href: "/" },
          { label: "Presentation", href: "/presentation" },
          { label: presentation?.name, href: `/presentation/${id}` },
        ]}
      />
      <Container className={styles.wrapper}>
        <Grid container spacing={3}>
          <Grid container item xs={12}>
            <Grid item xs={12} md={6}>
              <h1 style={{ marginLeft: 20 }}>{presentation?.name}</h1>
            </Grid>
            <Grid item xs={12} md={6} className={styles.buttonGroup}>
              <CopyToClipboard
                text={`${window?.location?.href}/slideshow`}
                onCopy={() => toast.success("Presentation link copied!")}
              >
                <Button sx={{ margin: "10px 0 10px 20px" }} variant="contained">
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
                <Grid item container xs={12}>
                  <Grid item xs={12}>
                    <FormLabel className={styles.formLabel}>
                      Controller
                    </FormLabel>
                  </Grid>

                  <Grid item xs={12}>
                    {slides[selectedSlide].type === "Multiple Choice" ? (
                      <TextField
                        label="Your question"
                        placeholder="Type your question"
                        fullWidth
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
                  </Grid>
                </Grid>

                {slides[selectedSlide].type === "Multiple Choice" &&
                  slides[selectedSlide].content.options.length > 0 &&
                  slides[selectedSlide].content.options.map((option, index) => (
                    <div key={index}>
                      <TextField
                        label="Option 1"
                        placeholder="Type option 1"
                        fullWidth
                        value={
                          slides[selectedSlide].content.options[index].label
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
                  ))}

                <Grid item xs={12}>
                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
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
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default PresentationDetail;
