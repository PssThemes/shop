port module Ports exposing (..)

import Data exposing (..)


-- import Dict exposing (Dict)

import Json.Decode as JD


-- Outgoing ports

import Json.Encode as JE


port saveToFirebase : { deleted : List String, created : List JE.Value, updated : List { id : String, normalizedProduct : JE.Value } } -> Cmd msg


port finish : () -> Cmd msg



-- Incoming ports


port start : (() -> msg) -> Sub msg


port received_settings : (JD.Value -> msg) -> Sub msg


port received_internalCategories : (JD.Value -> msg) -> Sub msg


port received_InternalProducts : (JD.Value -> msg) -> Sub msg


port received_ExternalProducts : (JD.Value -> msg) -> Sub msg


port received_Collects : (JD.Value -> msg) -> Sub msg
