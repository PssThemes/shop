port module Ports exposing (..)

import Data exposing (..)


-- import Dict exposing (Dict)

import Json.Decode as JD


-- Outgoing ports


port finish : () -> Cmd msg



-- Incoming ports


port start : (() -> msg) -> Sub msg


port received_settings : (JD.Value -> msg) -> Sub msg


port received_internalCategories : (JD.Value -> msg) -> Sub msg


port received_InternalProducts : (JD.Value -> msg) -> Sub msg


port received_ExternalProducts : (JD.Value -> msg) -> Sub msg


port received_Collects : (JD.Value -> msg) -> Sub msg
