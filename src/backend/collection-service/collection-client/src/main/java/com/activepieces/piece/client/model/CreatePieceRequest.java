package com.activepieces.piece.client.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
public class CreatePieceRequest {

    @JsonProperty @NotNull @Valid
    private CollectionVersionView version;

}