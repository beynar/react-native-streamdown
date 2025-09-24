import React, { memo, useRef, useState } from "react";
import { TouchableOpacity, Text, View, Modal } from "react-native";
import { useFootNotes, useStreamDown } from "../context";
import Slot from "./Slot";
import type { FootnoteRef } from "../marked/marked-footnotes";
import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";
import { Block } from "..";

interface FootnoteRefProps {
  token: FootnoteRef;
}

export const FootnoteRefComponent = memo<FootnoteRefProps>(({ token }) => {
  const streamdown = useStreamDown();
  const footNotes = useFootNotes();
  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef<BottomSheetMethods>(null);

  // Get the actual footnote content from context
  const footnoteContent = footNotes.getFootnote(token.label);

  const handlePress = () => {
    setIsOpen(!isOpen);
    sheetRef.current?.open();
    console.log("Footnote token:", token);
    console.log("Footnote content from context:", footNotes);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <View>
          <Modal visible={isOpen} animationType="slide" transparent={true}>
            <View
              style={{
                left: 0,
                right: 100,
                bottom: 0,
                position: "absolute",
                width: "100%",
                padding: 10,
                paddingBottom: 50,
                backgroundColor: "white",
                boxShadow: "0px -10px 10px rgba(0, 0, 0, 0.1)",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
              onTouchStart={handleClose}
            >
              <Slot
                props={{
                  token,
                  isOpen,
                }}
                render={streamdown.snippets.footnotePopover}
              >
                {footnoteContent && footnoteContent.type === "footnote" ? (
                  footnoteContent.lines?.map((line, index) => (
                    <Block block={line} key={index} />
                  ))
                ) : (
                  <Text>Footnote not found</Text>
                )}
              </Slot>
            </View>
          </Modal>
        </View>
      )}
      {/* Footnote Reference Button */}
      <Slot
        props={{
          token,
        }}
        render={streamdown.snippets.footnoteRef}
      >
        <Text style={streamdown.theme.footnoteRef.base} onPress={handlePress}>
          {token.label.replace("^", "")}
        </Text>
      </Slot>
    </>
  );
});

export default FootnoteRefComponent;
